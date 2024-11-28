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
  
  if (currentInput === "" && op === "-" && operands.length === 0) {
    currentInput = "-";
    allowOperators = false; 
    updateDisplay();
    return;
  }

  
  if (currentInput === "" && operators.length > 0) {
    operators[operators.length - 1] = op; 
    updateDisplay();
    return;
  }


  if (!allowOperators || currentInput === "") return;
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

  if (operands.length === 0 || operators.length === 0) return;

  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === "*" || operators[i] === "/") {
      let result;
      if (operators[i] === "*") {
        result = operands[i] * operands[i + 1];
      } else if (operators[i] === "/") {
        result = operands[i] / operands[i + 1];
      }

      operands[i] = result;
      operands.splice(i + 1, 1);
      operators.splice(i, 1);
      i--;
    }
  }

  // Loop for addition and subtraction
  for (let i = 0; i < operators.length; i++) {
    let result;
    if (operators[i] === "+") {
      result = operands[i] + operands[i + 1];
    } else if (operators[i] === "-") {
      result = operands[i] - operands[i + 1];
    }

    operands[i] = result;
    operands.splice(i + 1, 1);
    operators.splice(i, 1);
    i--;
  }

  let finalResult = operands[0];
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
      expression += ` ${operators[i]} ${operands[i + 1] || ""}`;
    }

    if (currentInput !== "") {
      expression += ` ${currentInput}`;
    }

    display.value = expression;
    
  }
}







