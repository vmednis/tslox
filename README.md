# TSLox

This is an implementation of the Lox interpreter from the first half of Robert Nystrom's excellent book [Crafting Interpreters](https://craftinginterpreters.com/). While the book implements the tree-walk interpreter in Java, this version is written in TypeScript.

## Disclaimer

I don't claim to be a TypeScript expert, so the code may not be perfectly idiomatic. This project was created as a learning exercise to understand both interpreter design and TypeScript better.

## What is Lox?

Lox is a dynamically-typed scripting language with a C-like syntax. It supports:
- Variables and data types (numbers, strings, booleans, nil)
- Arithmetic, comparison, and logical operators
- Control flow (if/else, while, for)
- Functions and closures
- Classes and inheritance

This implementation currently covers the tree-walking interpreter portion of the book (chapters 1-13).

## Prerequisites

- Node.js (v20 or higher recommended)
- npm

## Installation

```bash
npm install
```

## Running TSLox

### REPL Mode

To start an interactive REPL:

```bash
npm run dev
```

Or after building:

```bash
npm start
# or
tslox
```

### Running a Script

To execute a Lox script file:

```bash
npm run dev path/to/script.lox
```

Or after building:

```bash
tslox path/to/script.lox
```

### Example

```lox
// Example Lox code
print "Hello, world!";

var x = 10;
var y = 20;
print x + y;  // 30

print (1 + 2) * 3;  // 9
```

## Development

### Building

To compile the TypeScript code to a distributable:

```bash
npm run build
```

This uses `tsup` to bundle the code into `dist/main.mjs`.

### Generating the AST

The project uses a code generation script to create the AST (Abstract Syntax Tree) node classes. This approach is taken directly from the book and helps avoid repetitive boilerplate.

To generate the AST classes:

```bash
npm run generate-ast
```

This script (`tool/generate-ast.ts`) will:
- Generate `src/expr.ts` - Expression AST node classes (Binary, Grouping, Literal, Unary)
- Generate `src/stmt.ts` - Statement AST node classes (Expression, Print)

**Note:** These files are auto-generated and should not be edited manually. Any changes will be overwritten the next time you run the generate script. If you need to add new expression or statement types, edit `tool/generate-ast.ts` instead.

## Project Structure

```
tslox/
├── src/
│   ├── main.ts          # Entry point
│   ├── tslox.ts         # Main interpreter class and error handling
│   ├── scanner.ts       # Lexical analysis (tokenization)
│   ├── token.ts         # Token types and Token class
│   ├── parser.ts        # Syntax analysis (parsing)
│   ├── interpreter.ts   # Tree-walk interpreter and runtime
│   ├── expr.ts          # Expression AST nodes (auto-generated)
│   └── stmt.ts          # Statement AST nodes (auto-generated)
├── tool/
│   └── generate-ast.ts  # AST class generator
├── test-lox/            # Sample Lox programs
│   ├── language.lox
│   └── single-double.lox
└── package.json
```

## How It Works

1. **Scanner** (`scanner.ts`) - Performs lexical analysis, converting source code into tokens
2. **Parser** (`parser.ts`) - Performs syntax analysis, converting tokens into an Abstract Syntax Tree (AST)
3. **Interpreter** (`interpreter.ts`) - Walks the AST and executes the code using the Visitor pattern

The implementation uses the Visitor pattern extensively, which allows clean separation between the AST structure and the operations performed on it.

## Learning Resources

If you're interested in learning how interpreters work, I highly recommend reading [Crafting Interpreters](https://craftinginterpreters.com/). It's freely available online and does an excellent job of explaining language implementation from first principles.

The book is split into two parts:
- **Part I (Chapters 1-13)**: Tree-walk interpreter in Java (this implementation)
- **Part II (Chapters 14-30)**: Bytecode compiler and VM in C

## License

This is a learning project based on the book's code. The original content from Crafting Interpreters is © Robert Nystrom and is licensed under CC BY-NC-ND 4.0.
