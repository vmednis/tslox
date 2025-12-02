import { Expr, type ExprVisitor} from "@/expr";

export default class AstPrinter implements ExprVisitor<string> {
    print(expr: Expr): string {
        return expr.accept(this);
    }

    visitBinaryExpr(expr: Expr.Binary): string {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    visitGroupingExpr(expr: Expr.Grouping): string {
        return this.parenthesize("group", expr.expr);
    }

    visitLiteralExpr(expr: Expr.Literal): string {
        if (expr.value === null) return "nil";
        return expr.value.toString();
    }

    visitUnaryExpr(expr: Expr.Unary): string {
        return this.parenthesize(expr.operator.lexeme,  expr.right);
    }

    private parenthesize(name: string, ...exprs: Expr[]): string {
        let result = `(${name}`;
        for (const expr of exprs) {
            result += " ";
            result += expr.accept(this);
        }
        result += ")";
        return result;
    }
}