import Environment from "@/environment";
import { Expr, ExprVisitor } from "@/expr";
import RuntimeError from "@/runtimeError";
import { Stmt, StmtVisitor } from "@/stmt";
import Token, { TokenType } from "@/token";
import TsLox from "@/tslox"
import LoxCallable, { isLoxCallable } from "@/loxCallable";
import LoxFunction from "@/loxFunction";
import Return from "@/return";

export default class Interpreter implements ExprVisitor<any>, StmtVisitor<void> {
    readonly globals = new Environment();
    private environment = this.globals;
    private readonly locals: Map<Expr, number> = new Map();

    constructor() {
        this.globals.define("clock", new class implements LoxCallable {
            arity(): number {
                return 0;
            };

            call(interpreter: Interpreter, args: any[]): number {
                return Date.now() / 1000.0;
            };

            toString(): string {
                return "<native fn>";
            }
        }());
    }

    interpret(statements: (Stmt | null)[]): void {
        try {
            for (const statement of statements) {
                if (statement === null) continue;
                this.execute(statement);
            }
        } catch (error) {
            if (error instanceof RuntimeError) {
                TsLox.runtimeError(error.token, error.message);
            } else {
                throw error;
            }
        }
    }

    visitFunctionStmt(stmt: Stmt.Function): void {
        const func = new LoxFunction(stmt, this.environment);
        this.environment.define(stmt.name.lexeme, func);
    }

    visitExpressionStmt(stmt: Stmt.Expression): void {
        this.evaluate(stmt.expr);
    }

    visitIfStmt(stmt: Stmt.If): void {
        if (isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.thenBranch);
        } else if (stmt.elseBranch !== null) {
            this.execute(stmt.elseBranch);
        }
    }

    visitBlockStmt(stmt: Stmt.Block): void {
        this.executeBlock(stmt.statements, new Environment(this.environment));
    }

    visitPrintStmt(stmt: Stmt.Print): void {
        const value = this.evaluate(stmt.expr);
        console.log(stringify(value));
    }

    visitReturnStmt(stmt: Stmt.Return): void {
        let value = null;
        if (stmt.value !== null) {
            value = this.evaluate(stmt.value);
        }

        throw new Return(value);
    }

    visitVarStmt(stmt: Stmt.Var): void {
        let value: any = null;
        if (stmt.initializer !== null) {
            value = this.evaluate(stmt.initializer);
        }

        this.environment.define(stmt.name.lexeme, value);
    }

    visitWhileStmt(stmt: Stmt.While): void {
        while (isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
        }
    }

    visitAssignExpr(expr: Expr.Assign) {
        const value = this.evaluate(expr.value);
        
        const distance = this.locals.get(expr);
        if (distance !== undefined) {
            this.environment.assignAt(distance, expr.name.lexeme, value);
        } else {
            this.globals.assign(expr.name, value);
        }

        return value;
    }

    visitLiteralExpr(expr: Expr.Literal): any {
        return expr.value;
    }

    visitLogicalExpr(expr: Expr.Logical) {
        const left = this.evaluate(expr.left);

        if (expr.operator.type === TokenType.OR) {
            if (isTruthy(left)) return left;
        } else {
            if (!isTruthy(left)) return left;
        }

        return this.evaluate(expr.right);
    }

    visitGroupingExpr(expr: Expr.Grouping): any {
        return this.evaluate(expr.expr);
    }

    visitUnaryExpr(expr: Expr.Unary): any {
        const right = this.evaluate(expr.right);

        switch (expr.operator.type) {
            case TokenType.MINUS:
                checkNumberOperand(expr.operator, right);
                return -right;
            case TokenType.BANG:
                return !isTruthy(right);
        }

        return null;
    }

    visitVariableExpr(expr: Expr.Variable) {
        return this.lookUpVariable(expr);
    }

    lookUpVariable(expr: Expr.Variable): any {
        const distance = this.locals.get(expr);
        if (distance !== undefined) {
            return this.environment.getAt(distance, expr.name.lexeme);
        } else {
            return this.globals.get(expr.name);
        }
    }

    visitBinaryExpr(expr: Expr.Binary): any {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);

        switch (expr.operator.type) {
            case TokenType.MINUS:
                checkNumberOperands(expr.operator, left, right);
                return left - right;
            case TokenType.SLASH:
                checkNumberOperands(expr.operator, left, right);
                if (right === 0) {
                    throw new RuntimeError(expr.operator, "Division by zero.");
                }
                return left / right;
            case TokenType.STAR:
                checkNumberOperands(expr.operator, left, right);
                return left * right;
            case TokenType.PLUS:
                if (isNumber(left) && isNumber(right)) {
                    return left + right;
                }

                if (isString(left) && isString(right)) {
                    return left + right;
                }

                throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.");
            case TokenType.GREATER:
                checkNumberOperands(expr.operator, left, right);
                return left > right;
            case TokenType.GREATER_EQUAL:
                checkNumberOperands(expr.operator, left, right);
                return left >= right;
            case TokenType.LESS:
                checkNumberOperands(expr.operator, left, right);
                return left < right;
            case TokenType.LESS_EQUAL:
                checkNumberOperands(expr.operator, left, right);
                return left <= right;
            case TokenType.BANG_EQUAL:
                return !isEqual(left, right);
            case TokenType.EQUAL_EQUAL:
                return isEqual(left, right);
        }

        return null;
    }

    visitCallExpr(expr: Expr.Call): any {
        const callee = this.evaluate(expr.callee);

        let args = [];
        for(const arg of expr.args) {
            args.push(this.evaluate(arg));
        }

        if (!isLoxCallable(callee)) {
            throw new RuntimeError(expr.paren, "Can only call functions and classes.");
        }
        const func = callee as LoxCallable;
        if (args.length !== func.arity()) {
            throw new RuntimeError(expr.paren, `Expected ${func.arity()} arguments but got ${args.length}.`);
        }

        return func.call(this, args);
    }

    resolve(expr: Expr, depth: number): void {
        this.locals.set(expr, depth);
    }

    execute(stmt: Stmt): void {
        stmt.accept(this);
    }

    executeBlock(statements: Stmt[], environment: Environment): void {
        const previous = this.environment;
        try {
            this.environment = environment;

            for (const statement of statements) {
                this.execute(statement);
            }
        } finally {
            this.environment = previous;
        }
    }

    evaluate(expr: Expr): any {
        return expr.accept(this);
    }
}

// Helpers to identify types
function isTruthy(object: any): boolean {
    if (object === null) return false;
    if (isBoolean(object)) return object;
    return true;
}

function isBoolean(object: any): boolean {
    return typeof object === "boolean";
}

function isNumber(object: any): boolean {
    return typeof object === "number";
}

function isString(object: any): boolean {
    return typeof object === "string";
}

function isEqual(a: any, b: any): boolean {
    if (a === null && b === null) return true;
    if (a === null) return false;
    return a === b;
}

function checkNumberOperand(operator: Token, operand: any): void {
    if (isNumber(operand)) return;
    throw new RuntimeError(operator, "Operand must be a number.");
}

function checkNumberOperands(operator: Token, left: any, right: any): void {
    if (isNumber(left) && isNumber(right)) return;
    throw new RuntimeError(operator, "Operands must be numbers.");
}

function stringify(object: any): string {
    if (object === null) return "nil";
    return object.toString();
}