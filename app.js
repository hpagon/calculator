const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const working = document.querySelector("#working");
const result = document.querySelector("#result");
const equals = document.querySelector("#eq");
const clear = document.querySelector("#C");
let operator;
let opIndex = 0;
let numIndex = 0;
let numStack = [];
let opStack = [];

function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function operate(num1, num2, operator) {
  let newNum1 = parseFloat(num1);
  let newNum2 = parseFloat(num2);
  console.log(`Num1: ${newNum1} - Num2: ${newNum2}`);
  switch (operator) {
    case "+":
      return add(newNum1, newNum2);
    case "-":
      return subtract(newNum1, newNum2);
    case "x":
      return multiply(newNum1, newNum2);
    case "/":
      return divide(newNum1, newNum2);
    default:
      return "error";
  }
}

function findNum() {
  opIndex = working.textContent.length;
  let number = working.textContent.slice(numIndex, opIndex);
  numStack.push(number);
  numIndex = opIndex + 1;
}

function reset() {
  result.textContent = "";
  working.textContent = 0;
  numStack = [];
  opStack = [];
  numIndex = 0;
  opIndex = 0;
}

function updateResult() {
  if (numStack.length === 2 && result.textContent === "") {
    console.log("triggered");
    console.log(operate(numStack[0], numStack[1], opStack[0]));
    result.textContent = `${operate(numStack[0], numStack[1], opStack[0])}`;
    numStack.shift();
    opStack.shift();
  } else if (numStack.length === 2) {
    console.log("here");
    result.textContent = `${operate(
      result.textContent,
      numStack[1],
      opStack[0]
    )}`;
    numStack.shift();
    opStack.shift();
  }
}

for (let num of numbers) {
  num.addEventListener("click", () => {
    if (working.textContent == "0") working.textContent = num.textContent;
    else working.textContent += num.textContent;
  });
}

for (let op of operators) {
  op.addEventListener("click", () => {
    findNum();
    opStack.push(op.textContent);
    working.textContent += op.textContent;
    updateResult();
  });
}

clear.addEventListener("click", reset);

equals.addEventListener("click", () => {
  working.textContent += equals.textContent;
  findNum();
  updateResult();
  let temp = result.textContent;
  reset();
  working.textContent = temp;
});
