import { Expr, ExprVisitor } from "./expr";
import Token, { TokenType } from "./token";
import TsLox from "./tslox";

export default class Interpreter implements ExprVisitor<any> {
    interpret(expr: Expr): void {
        try {
            const value = this.evaluate(expr);
            console.log(stringify(value));
        } catch (error) {
            if (error instanceof RuntimeError) {
                TsLox.runtimeError(error.token, error.message);
            } else {
                throw error;
            }
        }
    }

    visitLiteralExpr(expr: Expr.Literal): any {
        return expr.value;
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

    private evaluate(expr: Expr): any {
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

export class RuntimeError extends Error {
    constructor(public readonly token: Token, message: string) {
        super(message);
    }
}