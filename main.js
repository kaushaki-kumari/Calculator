let display = document.getElementById("display");
let currentInput = "";
let operands = [];
let operators = [];
let allowOperators = false;

function inputValue(number) {
  if (currentInput.includes(".") && number === ".") return;
  currentInput += number;
  allowOperators = true;
  updateDisplay();
}

function inputCal(op) {
  // Handle negative numbers at start
  if (currentInput === "" && op === "-" && operands.length === 0) {
    currentInput = "-";
    allowOperators = false;
    updateDisplay();
    return;
  }

  // Handle operator replacement logic
  if (currentInput === "" && operators.length > 0) {
    let lastOp = operators[operators.length - 1];
    
    // Handle multiplication/division with minus--
    if ((lastOp === "*" || lastOp === "/") && op === "-") {
      operators.push(op);
    }
    // Handle multiplication-minus or division-minus with new operator
    else if (operators.length >= 2 && 
            (operators[operators.length - 2] === "*" || operators[operators.length - 2] === "/") && 
            lastOp === "-" && 
            op !== "-") {
      operators.splice(operators.length - 2, 2, op);
    }
    // Normal operator replacement
    else {
      operators[operators.length - 1] = op;
    }
    
    updateDisplay();
    return;
  }

  // Only proceed if there's a valid operand
  if (currentInput === "") return;
  
  // Add new operand and operator
  operands.push(parseFloat(currentInput));
  operators.push(op);
  currentInput = "";
  allowOperators = false;
  updateDisplay();
}

function clearDisplay() {
  currentInput = "";
  operands = [];
  operators = [];
  allowOperators = false;
  updateDisplay();
}

function calculateResult() {
  if (currentInput !== "") {
    operands.push(parseFloat(currentInput));
  }

  if (operands.length === 0) return;

  let tempOperands = [...operands];
  let tempOperators = [...operators];

  // Pre-process consecutive operators (* - or / -)
  for (let i = 0; i < tempOperators.length - 1; i++) {
    if ((tempOperators[i] === "*" || tempOperators[i] === "/") && 
        tempOperators[i + 1] === "-") {
      // Make the next number negative
      if (i + 1 < tempOperands.length) {
        tempOperands[i + 1] = -tempOperands[i + 1];
      }
      // Remove the minus operator
      tempOperators.splice(i + 1, 1);
      i--;
    }
  }

  // Handle multiplication and division first
  for (let i = 0; i < tempOperators.length; i++) {
    if (tempOperators[i] === "*" || tempOperators[i] === "/") {
      let result;
      if (tempOperators[i] === "*") {
        result = tempOperands[i] * tempOperands[i + 1];
      } else if (tempOperators[i] === "/") {
        if (tempOperands[i + 1] === 0) {
          currentInput = "Error";
          operands = [];
          operators = [];
          updateDisplay();
          return;
        }
        result = tempOperands[i] / tempOperands[i + 1];
      }

      tempOperands[i] = result;
      tempOperands.splice(i + 1, 1);
      tempOperators.splice(i, 1);
      i--;
    }
  }

  // Handle addition and subtraction
  for (let i = 0; i < tempOperators.length; i++) {
    let result;
    if (tempOperators[i] === "+") {
      result = tempOperands[i] + tempOperands[i + 1];
    } else if (tempOperators[i] === "-") {
      result = tempOperands[i] - tempOperands[i + 1];
    }

    tempOperands[i] = result;
    tempOperands.splice(i + 1, 1);
    tempOperators.splice(i, 1);
    i--;
  }

  let finalResult = tempOperands[0];
  if (Number.isInteger(finalResult)) {
    currentInput = finalResult.toString();
  } else {
    currentInput = finalResult.toFixed(2);
  }

  operands = [];
  operators = [];
  allowOperators = true;
  updateDisplay();
}

function updateDisplay() {
  if (currentInput === "" && operands.length === 0) {
    display.value = "0";
  } else {
    let expression = "";
    
    if (operands.length > 0) {
      expression += operands[0];
    }

    for (let i = 0; i < operators.length; i++) {
      let nextOperand = operands[i + 1];
      if (nextOperand !== undefined) {
        expression += ` ${operators[i]} ${nextOperand}`;
      } else {
        expression += ` ${operators[i]}`;
      }
    }

    if (currentInput !== "") {
      if (currentInput === "Error") {
        expression = currentInput;
      } else {
        expression += expression ? ` ${currentInput}` : currentInput;
      }
    }

    display.value = expression;
  }
  
  display.scrollLeft = display.scrollWidth;
}