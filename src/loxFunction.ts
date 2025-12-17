import LoxCallable from "@/loxCallable";
import { Stmt } from "@/stmt";
import Interpreter from "@/interpreter";
import Environment from "@/environment";
import Return from "@/return";

export default class LoxFunction implements LoxCallable {
    constructor(
        private readonly decleration: Stmt.Function,
        private readonly closure: Environment,
    ){};

    call(interperter: Interpreter, args: any[]): any {
        const environment = new Environment(this.closure);

        this.decleration.params.forEach((param, index) => {
            environment.define(param.lexeme, args[index]);
        });

        try {
            interperter.executeBlock(this.decleration.body, environment);
        } catch (returnValue) {
            if (returnValue instanceof Return) {
                return returnValue.value;
            } else {
                throw returnValue;
            }
        }

        return null;
    }

    arity(): number {
        return this.decleration.params.length;
    }

    toString(): string {
        return `<fn ${this.decleration.name.lexeme}>`;
    }
}