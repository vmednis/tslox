import { readFile } from "fs/promises";
import { createInterface } from "readline/promises";
import Scanner from "@/scanner";

export default class TsLox {
    static hadError = false;

    static async main() {
        console.log("TypeScript Lox Interpreter (Tree-Walking)");

        //Skip node and script name
        const args = process.argv.slice(2);

        if(args.length > 1) {
            console.log("Usage: tslox [script]");
            process.exit(64);
        } else if(args.length === 1) {
            await this.runFile(args[0]);
        } else {
            this.runPrompt();
        }
    }

    private static async runFile(filePath: string) {
        try {
            const contents = await readFile(filePath, "utf-8");
            this.run(contents);
            
            if(this.hadError) process.exit(65);
        } catch (error) {
            console.error(`Error reading file: ${filePath}`);
            process.exit(74);
        }
    }

    private static runPrompt() {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.setPrompt("> ");
        rl.prompt();

        rl.on("line", (line) => {
            this.run(line);
            this.hadError = false;
            rl.prompt();
        }).on("close", () => {
            console.log("Exiting REPL.");
            process.exit(0);
        });
    }

    private static run(source: string) {
        const scanner = new Scanner(source);
        const tokens = scanner.scanTokens();
        
        for (const token of tokens) {
            console.log(token.toString());
        }
    }

    static error(line: number, message: string) {
        this.report(line, "", message);
    }

    private static report(line: number, where: string, message: string) {
        console.error(`[line ${line}] Error${where}: ${message}`);
        this.hadError = true;
    }
}