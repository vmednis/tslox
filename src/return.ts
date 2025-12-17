export default class Return extends Error {
    constructor(public readonly value: any) {
        super("Return exception wasn't caught properly!");
    }
}