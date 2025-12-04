// This file is auto-generated. Do not edit manually.
// Run "npm run generate-ast" to regenerate.

import Token from "@/token";

export abstract class Expr {
    static Binary = class extends Expr {
        constructor(
            public readonly left: Expr,
            public readonly operator: Token,
            public readonly right: Expr
        ) {
            super();
        }

        accept<R>(visitor: ExprVisitor<R>): R {
            return visitor.visitBinaryExpr(this);
        }
    }

    static Grouping = class extends Expr {
        constructor(
            public readonly expr: Expr
        ) {
            super();
        }

        accept<R>(visitor: ExprVisitor<R>): R {
            return visitor.visitGroupingExpr(this);
        }
    }

    static Literal = class extends Expr {
        constructor(
            public readonly value: any
        ) {
            super();
        }

        accept<R>(visitor: ExprVisitor<R>): R {
            return visitor.visitLiteralExpr(this);
        }
    }

    static Unary = class extends Expr {
        constructor(
            public readonly operator: Token,
            public readonly right: Expr
        ) {
            super();
        }

        accept<R>(visitor: ExprVisitor<R>): R {
            return visitor.visitUnaryExpr(this);
        }
    }

    abstract accept<R>(visitor: ExprVisitor<R>): R;
}

export namespace Expr {
    export type Binary = InstanceType<typeof Expr.Binary>;
    export type Grouping = InstanceType<typeof Expr.Grouping>;
    export type Literal = InstanceType<typeof Expr.Literal>;
    export type Unary = InstanceType<typeof Expr.Unary>;
}

export interface ExprVisitor<R> {
    visitBinaryExpr(expr: Expr.Binary): R;
    visitGroupingExpr(expr: Expr.Grouping): R;
    visitLiteralExpr(expr: Expr.Literal): R;
    visitUnaryExpr(expr: Expr.Unary): R;
}
