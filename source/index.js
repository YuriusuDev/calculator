import {createSignal} from "solid-js";
import {render} from "solid-js/web";

/**
 * Tokenize an arithmetic expression and validate its operators.
 * @param {Array<string>} expression Arithmetic expression
 * @returns Infix expression in array form
 */
const validate = (expression) => {
  const infix = [];

  while (expression.length) {
    if (".0123456789".includes(expression.at(0))) {
      let value = expression.shift();
      while (expression.length && ".0123456789".includes(expression.at(0))) {
        value += expression.shift();
        // Handle invalid decimal numbers
        if (value.split(".").length - 1 > 1)
          throw new SyntaxError(`Unexpected operator '${value.at(-1)}'`);
      }
      // Make this a unary operand if previous operators are '(' and a '-'
      if (infix.length && infix.slice(-2).join("").includes("(-"))
        value = infix.pop() + value;
      infix.push(value);
    }
    else if ("^×÷+-".includes(expression.at(0))) {
      // Handle immediate operators
      if (infix.length && "^×÷+-".includes(infix.at(-1)))
        throw new SyntaxError(`Unexpected operator '${expression.at(0)}'`);
      infix.push(expression.shift());
    }
    else if ("(".includes(expression.at(0))) {
      // Add implicit multiplication operator
      if (infix.length && !"(^×÷+-".includes(infix.at(-1)))
        infix.push("×");
      infix.push(expression.shift());
      // Handle immediate operator that is not a unary operator
      if (expression.length && "^×÷+".includes(expression.at(0)))
        throw new SyntaxError(`Unexpected operator '${expression.at(0)}'`);
    }
    else if (")".includes(expression.at(0))) {
      infix.push(expression.shift());
      // Add implicit multiplication operator
      if (expression.length && !"^×÷+-)".includes(expression.at(0))) {
        infix.push("×");
      }
    }
    // Handle invalid tokens
    else throw new SyntaxError(`Unexpected token '${expression.at(0)}'`);
  }

  // Return the infix expression
  return infix;
};


/**
 * Converts an infix expression into postfix notation and calculate the result.
 * @param {Array<string>} infix Infix expression in array form
 * @returns Computed number value
 */
const evaluate = (infix) => {
  const precedence = {
    "+": 1,
    "-": 1,
    "×": 2,
    "÷": 2,
    "^": 3
  }

  const operators = [];

  const postfix = [];

  for (const token of infix) {
    if ("(".includes(token)) {
      operators.push(token);
    }
    else if (")".includes(token)) {
      // Append the operators from the stack until an opening parenthesis is encountered
      while (operators.length && !"(".includes(operators.at(-1)))
        postfix.push(operators.pop());
      if (!operators.length)
        throw new SyntaxError(`Mismatched parenthesis '${token}'`);
      // Discard the opening parenthesis
      operators.pop();
    }
    else if ("^×÷+-".includes(token)) {
      // Append the operators from the stack while precedence is greater than or equal to the current operator
      while (operators.length && precedence[operators.at(-1)] >= precedence[token])
        postfix.push(operators.pop());
      // Place the current operator to the stack
      operators.push(token);
    }
    else postfix.push(token);
  }

  // Append remaining operators from the stack and validate open and closing parentheses
  while (operators.length) {
    if ("()".includes(operators.at(-1)))
      throw new SyntaxError(`Mismatched parenthesis '${operators.at(-1)}'`);
    postfix.push(operators.pop());
  }

  const stack = [];

  for (const token of postfix) {
    if ("^×÷+-".includes(token)) {
      const operand2 = parseFloat(stack.pop());
      const operand1 = parseFloat(stack.pop());
      // Perform arithmetic operations based on the current operator
      if ("^".includes(token))
        stack.push(operand1 ** operand2);
      else if ("×".includes(token))
        stack.push(operand1 * operand2);
      else if ("÷".includes(token)) {
        if (operand2 === 0)
          throw new Error("Can't divide by 0");
        stack.push(operand1 / operand2);
      }
      else if ("+".includes(token))
        stack.push(operand1 + operand2);
      else if ("-".includes(token))
        stack.push(operand1 - operand2);
    }
    else stack.push(token);
  }

  // Check if there's only one value left in the stack, which should be the final result
  if (stack.length !== 1)
    throw new Error(`Invalid expression '${infix.join("")}'`);

  // Return the final computed result
  return stack.pop();
};


const Calculator = () => {
  const [formula, setFormula] = createSignal("");
  const [answer, setAnswer] = createSignal("");

  const handleButtonClick = (value) => {
    if (value === "C") {
      setFormula("");
      setAnswer("");
    }
    else if (value === "c") {
      setFormula(formula().slice(0, -1));
      setAnswer("")
    }
    else if (value === "=") {
      if (!isNaN(answer())) {
        setFormula(answer());
        setAnswer("");
      }
    }
    else {
      try {
        const expression = validate((formula() + value).split(""));
        setFormula(formula() + value);
        const result = evaluate(expression);
        setAnswer(result);
      }
      catch (error) {
        setAnswer(error.message);
      }
    }
  };

  return (
    <>
      <header>
        <h1 className="topbar_title"></h1>
        <button className="topbar_button" onClick={() => handleButtonClick("C")}><i className="material-icons">clear</i></button>
      </header>
      <main>
        <div className="expression">
          <div className="expression_formula"><span>{formula()}</span></div>
          <div className="expression_answer"><span>{answer()}</span></div>
        </div>
        <div className="keypad">
          <div className="keypad_row">
            <button className="keypad_button" onClick={() => handleButtonClick("7")}>7</button>
            <button className="keypad_button" onClick={() => handleButtonClick("8")}>8</button>
            <button className="keypad_button" onClick={() => handleButtonClick("9")}>9</button>
            <button className="keypad_button" onClick={() => handleButtonClick("^")}>^</button>
            <button className="keypad_button" onClick={() => handleButtonClick("c")}><i className="material-icons">backspace</i></button>
          </div>
          <div className="keypad_row">
            <button className="keypad_button" onClick={() => handleButtonClick("4")}>4</button>
            <button className="keypad_button" onClick={() => handleButtonClick("5")}>5</button>
            <button className="keypad_button" onClick={() => handleButtonClick("6")}>6</button>
            <button className="keypad_button" onClick={() => handleButtonClick("×")}>×</button>
            <button className="keypad_button" onClick={() => handleButtonClick("÷")}>÷</button>
          </div>
          <div className="keypad_row">
            <button className="keypad_button" onClick={() => handleButtonClick("1")}>1</button>
            <button className="keypad_button" onClick={() => handleButtonClick("2")}>2</button>
            <button className="keypad_button" onClick={() => handleButtonClick("3")}>3</button>
            <button className="keypad_button" onClick={() => handleButtonClick("+")}>+</button>
            <button className="keypad_button" onClick={() => handleButtonClick("-")}>-</button>
          </div>
          <div className="keypad_row">
            <button className="keypad_button" onClick={() => handleButtonClick("0")}>0</button>
            <button className="keypad_button" onClick={() => handleButtonClick(".")}>.</button>
            <button className="keypad_button" onClick={() => handleButtonClick("(")}>(</button>
            <button className="keypad_button" onClick={() => handleButtonClick(")")}>)</button>
            <button className="keypad_button keypad_button-equal" onClick={() => handleButtonClick("=")}>=</button>
          </div>
        </div>
      </main>
    </>
  )
};


// Render component
render(Calculator, document.body);


// Register service worker
navigator?.serviceWorker.register("./service-worker.js", {scope: "./"});
