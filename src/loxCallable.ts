import Interpreter from "@/interpreter";

export default interface LoxCallable {
    arity(): number;
    call(interperter: Interpreter, args: any[]): any;
}

export function isLoxCallable(object: any): object is LoxCallable {
    return (
        object !== null &&
        typeof object === "object" &&
        typeof object.arity === "function" &&
        typeof object.call === "function"
    )
}