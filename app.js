const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const working = document.querySelector("#working");
const result = document.querySelector("#result");
const equals = document.querySelector("#eq");
const clear = document.querySelector("#C");
const decimal = document.querySelector("#decimal");
const del = document.querySelector("#del");
let operator;
let opIndex = 0;
let numIndex = 0;
let numStack = [];
let opStack = [];
let canClear = false;
let currVal;
let canDec = true;
let divByZero = false;
let numHistory = [];
let numIndexHistory = [0];
let opHistory = [];
let opIndexHistory = [0];
currValHistory = [];

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
  //   console.log(`Num1: ${newNum1} - Num2: ${newNum2}`);
  //   console.log(numStack);
  //   console.log(opStack);
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
  opIndexHistory.push(opIndex);
  let number = working.textContent.slice(numIndex, opIndex);
  //   console.log(number);
  if (number === "") return number;
  numStack.pop();
  numStack.push(number);
  numIndex = opIndex + 1;
  numIndexHistory.push(numIndex);
  numHistory.push(number);
  return number;
}

function lengthenNum() {
  if (numStack.length === 1) {
    console.log(":(");
    let number = working.textContent.slice(
      numIndex,
      working.textContent.length
    );
    numStack.push(number);
  } else if (numStack.length === 2) {
    let number = working.textContent.slice(
      numIndex,
      working.textContent.length
    );
    console.log("popped");
    numStack.pop();
    numStack.push(number);
  }
}

function reset() {
  result.textContent = "";
  working.textContent = 0;
  numStack = [];
  opStack = [];
  numIndex = 0;
  opIndex = 0;
  currVal = undefined;
  opHistory = [];
  opIndexHistory = [0];
  numHistory = [];
  numIndexHistory = [0];
  currValHistory = [];
}

function isInt(num) {
  return num % 1 === 0;
}

function updateResult() {
  if (parseFloat(numStack[1]) === 0) {
    reset();
    result.textContent = "Can't divide by 0";
    divByZero = true;
  }
  if (numStack.length === 2 && currVal === undefined) {
    // console.log("triggered");
    // console.log(operate(numStack[0], numStack[1], opStack[0]));
    // currVal = operate(numStack[0], numStack[1], opStack[0]);
    let num = operate(numStack[0], numStack[1], opStack[0]);
    if (isInt(num)) currVal = num;
    else currVal = parseFloat(num.toFixed(10));
    result.textContent = currVal;
    numStack.shift();
    opStack.shift();
  } else if (numStack.length === 2) {
    // console.log("here");
    let num = operate(currVal, numStack[1], opStack[0]);
    if (isInt(num)) currVal = num;
    else currVal = parseFloat(num.toFixed(10));
    // currVal = operate(currVal, numStack[1], opStack[0]);
    result.textContent = currVal;
    numStack.shift();
    opStack.shift();
  }
  currValHistory.push(currVal);
  canDec = true;
}

function previewResult() {
  if (parseFloat(numStack[1]) === 0) {
    result.textContent = "";
  } else if (numStack.length === 2 && currVal === undefined) {
    // console.log("triggered 2");
    // console.log(operate(numStack[0], numStack[1], opStack[0]));
    // result.textContent = `${operate(numStack[0], numStack[1], opStack[0])}`;
    let num = operate(numStack[0], numStack[1], opStack[0]);
    if (isInt(num)) result.textContent = num;
    else result.textContent = parseFloat(num.toFixed(10));
  } else if (numStack.length === 2) {
    // console.log("here 2");
    // result.textContent = `${operate(currVal, numStack[1], opStack[0])}`;
    let num = operate(currVal, numStack[1], opStack[0]);
    if (isInt(num)) result.textContent = num;
    else result.textContent = parseFloat(num.toFixed(10));
  }
}

for (let num of numbers) {
  num.addEventListener("click", () => {
    divByZero = false;
    if (canClear === true) {
      reset();
      canClear = false;
      working.textContent = num.textContent;
    } else if (working.textContent === "0")
      working.textContent = num.textContent;
    else {
      working.textContent += num.textContent;
      lengthenNum();
      previewResult();
    }
  });
}

for (let op of operators) {
  op.addEventListener("click", () => {
    if (divByZero === true) return;
    canClear = false;
    if (findNum() === "") {
      //   console.log("here?");
      opIndexHistory.pop();
      opStack.pop();
      working.textContent = working.textContent.slice(
        0,
        working.textContent.length - 1
      );
    }
    working.textContent += op.textContent;
    opStack.push(op.textContent);
    opHistory.push(op.textContent);
    updateResult();
    if (divByZero === true) {
      let temp = result.textContent;
      reset();
      working.textContent = temp;
      canClear = true;
    }
  });
}

clear.addEventListener("click", reset, () => {
  divByZero = false;
});

equals.addEventListener("click", () => {
  if (canClear === true) return;
  //   console.log("here1");
  //   if (result.textContent === "") return;
  if (numStack.length < 2) return;
  else {
    // console.log("here2");
    let num = findNum();
    // console.log("but here???");
    updateResult();
    let temp = result.textContent;
    reset();
    working.textContent = temp;
    canClear = true;
  }
});

decimal.addEventListener("click", () => {
  if (canDec) {
    divByZero = false;
    if (canClear === true) {
      reset();
      canClear = false;
    }
    working.textContent += decimal.textContent;
    canDec = false;
  }
});

del.addEventListener("click", () => {
  console.log("deleting");
  if (canClear === true || working.textContent.length === 1) {
    console.log("cleared");
    reset();
    canClear = false;
    working.textContent += 0;
  } 
  else if(opIndex === working.textContent.length - 1 && opHistory.length === 1) {
    let temp = working.textContent;
    reset();
    working.textContent = temp;
  }
  else if (opIndex === working.textContent.length - 1) {
    // Reset opstack and opIndex to what it was before op that was removed was placed
    opIndexHistory.pop();
    opHistory.pop();
    opIndex = opIndexHistory[opIndexHistory.length - 1];
    opStack.pop();
    if (opHistory.length !== 0) opStack.push(opHistory[opHistory.length - 1]);
    // revert numIndex and currVal to what they were before
    numIndexHistory.pop();
    numIndex = numIndexHistory[numIndexHistory.length - 1];
    // numStack.shift;
    currValHistory.pop();
    currVal = currValHistory[currValHistory.length - 1];
    // reset numStack when only one operand left since operation consists
    // of first element and the second inputted one which is taken by lengthenNum
    if (opHistory.length === 1) {
      numStack = [];
      numStack.push(numHistory[0]);
    }
    if (numHistory.length === 1) {
      numHistory.pop();
      numStack.pop();
    }
  }
  working.textContent = working.textContent.slice(
    0,
    working.textContent.length - 1
  );
});
