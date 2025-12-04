import { writeFile } from "fs/promises"

const args = process.argv.slice(2);

if (args.length != 1) {
    console.log("Usage: generate-ast <output directory>");
    process.exit(64);
}

const outputDir = args[0];

await defineAst(outputDir, "Expr", [
    "Binary -> left: Expr, operator: Token, right: Expr",
    "Grouping -> expr: Expr",
    "Literal -> value: any",
    "Unary -> operator: Token, right: Expr",
], [{
    import: 'Token',
    from: '@/token'
}]);

process.exit(0);

async function defineAst(outputDir: string, baseName: string, types: string[], imports: { import: string, from: string }[]) {
    const path = outputDir + "/" + baseName.toLowerCase() + ".ts";
    const lines: string[] = [];
    const write = (indent: number, line: string) => {
        lines.push(" ".repeat(indent * 4) + line);
    }

    console.log(`Generating ${path}...`);

    write(0, `// This file is auto-generated. Do not edit manually.`);
    write(0, `// Run "npm run generate-ast" to regenerate.`);
    write(0, ``);
    defineImports(write, imports);
    write(0, ``);
    write(0, `export abstract class ${baseName} {`);

    for (const type of types) {
        defineType(write, baseName, type);
    }

    write(1, `abstract accept<R>(visitor: ${baseName}Visitor<R>): R;`);
    write(0, `}`);
    write(0, ``);
    defineNamespace(write, baseName, types);
    write(0, ``);
    defineVisitor(write, baseName, types);
    write(0, ``);

    const output = lines.join("\n");
    await writeFile(path, output);
    console.log(`Wrote ${path}`);
}

function defineImports(write: (indent: number, line: string) => void, imports: { import: string, from: string }[]) {
    for (const imp of imports) {
        write(0, `import ${imp.import} from "${imp.from}";`);
    }
}

function defineNamespace(write: (indent: number, line: string) => void, baseName: string, types: string[]) {
    write(0, `export namespace ${baseName} {`);
    for (const type of types) {
        const className = type.split("->")[0].trim();
        write(1, `export type ${className} = InstanceType<typeof ${baseName}.${className}>;`);
    }
    write(0, `}`);
}

function defineType(write: (indent: number, line: string) => void, baseName: string, type: string) {
    const className = type.split("->")[0].trim();
    const fields = type.split("->")[1].trim();

    write(1, `static ${className} = class extends ${baseName} {`);
    write(2, `constructor(`);

    const fieldList = fields.split(",").map(f => f.trim());
    for (let i = 0; i < fieldList.length; i++) {
        const field = fieldList[i];
        const separator = i == fieldList.length - 1 ? "" : ",";
        write(3, `public readonly ${field}${separator}`);
    }

    write(2, `) {`);
    write(3, `super();`);
    write(2, `}`);
    write(0, ``);
    write(2, `accept<R>(visitor: ${baseName}Visitor<R>): R {`);
    write(3, `return visitor.visit${className}${baseName}(this);`);
    write(2, `}`);
    write(1, `}`);
    write(0, ``);
}

function defineVisitor(write: (indent: number, line: string) => void, baseName: string, types: string[]) {
    write(0, `export interface ${baseName}Visitor<R> {`);
    for (const type of types) {
        const typeName = type.split("->")[0].trim();
        write(1, `visit${typeName}${baseName}(${baseName.toLowerCase()}: ${baseName}.${typeName}): R;`);
    }
    write(0, `}`);
}

export { };