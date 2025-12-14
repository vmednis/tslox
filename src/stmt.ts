// This file is auto-generated. Do not edit manually.
// Run "npm run generate-ast" to regenerate.

import { Expr } from "@/expr";
import Token from "@/token";

export abstract class Stmt {
    static Block = class extends Stmt {
        constructor(
            public readonly statements: Stmt[]
        ) {
            super();
        }

        accept<R>(visitor: StmtVisitor<R>): R {
            return visitor.visitBlockStmt(this);
        }
    }

    static Expression = class extends Stmt {
        constructor(
            public readonly expr: Expr
        ) {
            super();
        }

        accept<R>(visitor: StmtVisitor<R>): R {
            return visitor.visitExpressionStmt(this);
        }
    }

    static Print = class extends Stmt {
        constructor(
            public readonly expr: Expr
        ) {
            super();
        }

        accept<R>(visitor: StmtVisitor<R>): R {
            return visitor.visitPrintStmt(this);
        }
    }

    static Var = class extends Stmt {
        constructor(
            public readonly name: Token,
            public readonly initializer: Expr | null
        ) {
            super();
        }

        accept<R>(visitor: StmtVisitor<R>): R {
            return visitor.visitVarStmt(this);
        }
    }

    abstract accept<R>(visitor: StmtVisitor<R>): R;
}

export namespace Stmt {
    export type Block = InstanceType<typeof Stmt.Block>;
    export type Expression = InstanceType<typeof Stmt.Expression>;
    export type Print = InstanceType<typeof Stmt.Print>;
    export type Var = InstanceType<typeof Stmt.Var>;
}

export interface StmtVisitor<R> {
    visitBlockStmt(stmt: Stmt.Block): R;
    visitExpressionStmt(stmt: Stmt.Expression): R;
    visitPrintStmt(stmt: Stmt.Print): R;
    visitVarStmt(stmt: Stmt.Var): R;
}
