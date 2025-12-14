# TSLox

This is an implementation of the Lox interpreter from the first half of Robert Nystrom's excellent book [Crafting Interpreters](https://craftinginterpreters.com/). While the book implements the tree-walk interpreter in Java, this version is written in TypeScript.

## Disclaimer

I don't claim to be a TypeScript expert, so the code may not be perfectly idiomatic. This project was created as a learning exercise to understand both interpreter design and TypeScript better.

## What is Lox?

Lox is a dynamically-typed scripting language with a C-like syntax. This implementation currently supports:
- **Data types**: numbers, strings, booleans, nil
- **Expressions**: arithmetic, comparison, logical operators, grouping
- **Variables**: declaration, assignment, and access
- **Statements**: print statements, expression statements
- **Block scoping**: lexical scoping with nested blocks

Future chapters will add control flow, functions, classes, and inheritance.

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

### Example Programs

```lox
// Example 1: Basic expressions
print "Hello, world!";
print (1 + 2) * 3;  // 9
```

```lox
// Example 2: Variables
var x = 10;
var y = 20;
print x + y;  // 30

x = 15;
print x;  // 15
```

```lox
// Example 3: Block scoping
var a = "global a";
var b = "global b";
{
  var a = "outer a";
  var b = "outer b";
  {
    var a = "inner a";
    print a;  // inner a
    print b;  // outer b
  }
  print a;  // outer a
  print b;  // outer b
}
print a;  // global a
print b;  // global b
```

See the `test-lox/` directory for more example programs.

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
- Generate `src/expr.ts` - Expression AST node classes (Assign, Binary, Grouping, Literal, Unary, Variable)
- Generate `src/stmt.ts` - Statement AST node classes (Block, Expression, Print, Var)

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
│   ├── environment.ts   # Variable scope management
│   ├── runtimeError.ts  # Runtime error class
│   ├── expr.ts          # Expression AST nodes (auto-generated)
│   └── stmt.ts          # Statement AST nodes (auto-generated)
├── tool/
│   └── generate-ast.ts  # AST class generator
├── test-lox/            # Sample Lox programs
│   ├── blocks.lox
│   ├── language.lox
│   └── single-double.lox
├── tsconfig.json        # TypeScript configuration
├── tsup.config.ts       # Build configuration
└── package.json
```

## How It Works

1. **Scanner** (`scanner.ts`) - Performs lexical analysis, converting source code into tokens
2. **Parser** (`parser.ts`) - Performs syntax analysis, converting tokens into an Abstract Syntax Tree (AST)
3. **Interpreter** (`interpreter.ts`) - Walks the AST and executes the code using the Visitor pattern
4. **Environment** (`environment.ts`) - Manages variable storage and lexical scoping

The implementation uses the Visitor pattern extensively, which allows clean separation between the AST structure and the operations performed on it.

## Learning Resources

If you're interested in learning how interpreters work, I highly recommend reading [Crafting Interpreters](https://craftinginterpreters.com/). It's freely available online and does an excellent job of explaining language implementation from first principles.

The book is split into two parts:
- **Part I (Chapters 1-13)**: Tree-walk interpreter in Java (this implementation)
- **Part II (Chapters 14-30)**: Bytecode compiler and VM in C

## Current Progress

This implementation currently covers through Chapter 8 of Crafting Interpreters:
- ✅ Chapter 4: Scanning
- ✅ Chapter 5: Representing Code (AST generation)
- ✅ Chapter 6: Parsing Expressions
- ✅ Chapter 7: Evaluating Expressions
- ✅ Chapter 8: Statements and State

Still to implement:
- ⬜ Chapter 9: Control Flow
- ⬜ Chapter 10: Functions
- ⬜ Chapter 11: Resolving and Binding
- ⬜ Chapter 12: Classes
- ⬜ Chapter 13: Inheritance

## License

This is a learning project based on the book's code. The original content from Crafting Interpreters is © Robert Nystrom and is licensed under CC BY-NC-ND 4.0.
