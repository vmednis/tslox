import { Expr, ExprVisitor } from "@/expr";
import Interpreter from "@/interpreter";
import { Stmt, StmtVisitor } from "@/stmt";
import Token from "./token";
import TsLox from "./tslox";

export default class Resolver implements ExprVisitor<void>, StmtVisitor<void> {
    private readonly scopes: Array<Map<string, boolean>> = [];
    private currentFunction: FunctionType = FunctionType.NONE;

    constructor(private readonly interpreter: Interpreter) {}

    visitAssignExpr(expr: Expr.Assign): void {
        this.resolveExpr(expr.value);
        this.resolveLocal(expr, expr.name);
    }

    visitBinaryExpr(expr: Expr.Binary): void {
        this.resolveExpr(expr.left);
        this.resolveExpr(expr.right);
    }

    visitCallExpr(expr: Expr.Call): void {
        this.resolveExpr(expr.callee);
        for (const arg of expr.args) {
            this.resolveExpr(arg);
        }
    }

    visitGroupingExpr(expr: Expr.Grouping): void {
        this.resolveExpr(expr.expr);
    }

    visitLiteralExpr(expr: Expr.Literal): void {
        // Literals have nothing to resolve.
    }

    visitLogicalExpr(expr: Expr.Logical): void {
        this.resolveExpr(expr.left);
        this.resolveExpr(expr.right);
    }

    visitUnaryExpr(expr: Expr.Unary): void {
        this.resolveExpr(expr.right);
    }

    visitVariableExpr(expr: Expr.Variable): void {
        if (this.scopes.length !== 0) {
            const scope = this.scopes[this.scopes.length - 1];
            if(scope.get(expr.name.lexeme) == false) {
                TsLox.parserError(expr.name, "Can't read local variable in it's own initializer");
            }
        }

        this.resolveLocal(expr, expr.name);
    }

    visitBlockStmt(stmt: Stmt.Block): void {
        this.beginScope();
        this.resolveStmts(stmt.statements);
        this.endScope();
    }

    visitExpressionStmt(stmt: Stmt.Expression): void {
        this.resolveExpr(stmt.expr);
    }

    visitFunctionStmt(stmt: Stmt.Function): void {
        this.declare(stmt.name);
        this.define(stmt.name);

        this.resolveFunction(stmt, FunctionType.FUNCTION);
    }

    visitIfStmt(stmt: Stmt.If): void {
        this.resolveExpr(stmt.condition);
        this.resolveStmt(stmt.thenBranch);
        if (stmt.elseBranch !== null) {
            this.resolveStmt(stmt.elseBranch);
        }
    }

    visitPrintStmt(stmt: Stmt.Print): void {
        this.resolveExpr(stmt.expr);
    }

    visitReturnStmt(stmt: Stmt.Return): void {
        if (this.currentFunction === FunctionType.NONE) {
            TsLox.parserError(stmt.keyword, "Can't return from top-level code.");
        }

        if (stmt.value !== null) {
            this.resolveExpr(stmt.value);
        }
    }

    visitVarStmt(stmt: Stmt.Var): void {
        this.declare(stmt.name);
        if (stmt.initializer !== null) {
            this.resolveExpr(stmt.initializer);
        }
        this.define(stmt.name);
    }

    visitWhileStmt(stmt: Stmt.While): void {
        this.resolveExpr(stmt.condition);
        this.resolveStmt(stmt.body);
    }

    resolveStmts(statements: (Stmt | null)[]): void {
        for (const statement of statements) {
            if (statement === null) continue;
            this.resolveStmt(statement);
        }
    }

    private resolveStmt(stmt: Stmt): void {
        stmt.accept(this);
    }

    private resolveExpr(expr: Expr): void {
        expr.accept(this);
    }

    private beginScope(): void {
        this.scopes.push(new Map<string, boolean>());
    }

    private endScope(): void {
        this.scopes.pop();
    }

    private declare(name: Token): void {
        if (this.scopes.length === 0) return;
        const scope = this.scopes[this.scopes.length - 1];
        if (scope.has(name.lexeme)) {
            TsLox.parserError(name, "Variable with this name already declared in this scope.");
        }
        scope.set(name.lexeme, false);
    }

    private define(name: Token): void {
        if (this.scopes.length === 0) return;

        const scope = this.scopes[this.scopes.length - 1];
        scope.set(name.lexeme, true);
    }

    private resolveLocal(expr: Expr, name: Token) {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].has(name.lexeme)) {
                this.interpreter.resolve(expr, this.scopes.length - 1 - i);
                return;
            }
        }
    }

    private resolveFunction(func: Stmt.Function, functionType: FunctionType): void {
        const enclosingFunction = this.currentFunction;
        this.currentFunction = functionType;
        
        this.beginScope();
        for (const param of func.params) {
            this.declare(param);
            this.define(param);
        }
        this.resolveStmts(func.body);
        this.endScope();

        this.currentFunction = enclosingFunction;
    }
}

enum FunctionType {
    NONE,
    FUNCTION,
}