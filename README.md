# TSLox

This is an implementation of the Lox interpreter from the first half of Robert Nystrom's excellent book [Crafting Interpreters](https://craftinginterpreters.com/). While the book implements the tree-walk interpreter in Java, this version is written in TypeScript.

## Disclaimer

I don't claim to be a TypeScript expert, so the code may not be perfectly idiomatic. This project was created as a learning exercise to understand both interpreter design and TypeScript better.

## What is Lox?

Lox is a dynamically-typed scripting language with a C-like syntax. This implementation currently supports:
- **Data types**: numbers, strings, booleans, nil
- **Expressions**: arithmetic, comparison, logical operators (and/or), grouping
- **Variables**: declaration, assignment, and access
- **Statements**: print statements, expression statements
- **Block scoping**: lexical scoping with nested blocks
- **Control flow**: if/else statements, while loops, for loops
- **Logical operators**: short-circuiting `and` and `or`

Future chapters will add functions, classes, and inheritance.

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

### Example Program

```lox
// Fibonacci sequence with control flow
var a = 0;
var b = 1;
var temp;

print "Fibonacci sequence:";

for (var i = 0; i < 10; i = i + 1) {
  if (a < 100) {
    print a;
  } else {
    print "Too large!";
  }
  
  temp = a;
  a = b;
  b = temp + b;
}

// Logical operators with short-circuiting
var result = nil or "default value";
print result;  // default value
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
- Generate `src/expr.ts` - Expression AST node classes (Assign, Binary, Grouping, Literal, Logical, Unary, Variable)
- Generate `src/stmt.ts` - Statement AST node classes (Block, Expression, If, Print, Var, While)

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
│   ├── blocks.lox       # Block scoping examples
│   ├── branching.lox    # If/else and logical operators
│   ├── for-fibonacci.lox # For loop example
│   ├── language.lox     # Variable declarations
│   ├── single-double.lox # Token scanning test
│   └── while.lox        # While loop example
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

This implementation currently covers through Chapter 9 of Crafting Interpreters:
- ✅ Chapter 4: Scanning
- ✅ Chapter 5: Representing Code (AST generation)
- ✅ Chapter 6: Parsing Expressions
- ✅ Chapter 7: Evaluating Expressions
- ✅ Chapter 8: Statements and State
- ✅ Chapter 9: Control Flow

Still to implement:
- ⬜ Chapter 10: Functions
- ⬜ Chapter 11: Resolving and Binding
- ⬜ Chapter 12: Classes
- ⬜ Chapter 13: Inheritance

## License

This is a learning project based on the book's code. The original content from Crafting Interpreters is © Robert Nystrom and is licensed under CC BY-NC-ND 4.0.
