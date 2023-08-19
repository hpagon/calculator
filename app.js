const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const working = document.querySelector("#working");
const result = document.querySelector("#result");
const equals = document.querySelector("#eq");
const clear = document.querySelector("#C");
const decimal = document.querySelector("#decimal");
const del = document.querySelector("#del");
const sign = document.querySelector("#sign");
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
const numArray = [
  document.querySelector("#zero"),
  document.querySelector("#one"),
  document.querySelector("#two"),
  document.querySelector("#three"),
  document.querySelector("#four"),
  document.querySelector("#five"),
  document.querySelector("#six"),
  document.querySelector("#seven"),
  document.querySelector("#eight"),
  document.querySelector("#nine"),
];
const opObject = {
  "+": document.querySelector("#add"),
  "-": document.querySelector("#sub"),
  "x": document.querySelector("#mult"),
  "/": document.querySelector("#div"),
};

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
  canDec = true;
}

function isInt(num) {
  return num % 1 === 0;
}

function updateResult() {
  if (parseFloat(numStack[1]) === 0 && opStack[0] === "/") {
    reset();
    result.textContent = "Can't divide by 0";
    divByZero = true;
  }
  if (numStack.length === 2 && currVal === undefined) {
    let num = operate(numStack[0], numStack[1], opStack[0]);
    if (isInt(num)) currVal = num;
    else currVal = parseFloat(num.toFixed(10));
    result.textContent = currVal;
    numStack.shift();
    opStack.shift();
  } else if (numStack.length === 2) {
    let num = operate(currVal, numStack[1], opStack[0]);
    if (isInt(num)) currVal = num;
    else currVal = parseFloat(num.toFixed(10));
    result.textContent = currVal;
    numStack.shift();
    opStack.shift();
  }
  currValHistory.push(currVal);
  canDec = true;
}

function previewResult() {
  if (parseFloat(numStack[1]) === 0 && opStack[0] === "/") {
    result.textContent = "";
  } else if (numStack.length === 2 && currVal === undefined) {
    let num = operate(numStack[0], numStack[1], opStack[0]);
    if (isInt(num)) result.textContent = num;
    else result.textContent = parseFloat(num.toFixed(10));
  } else if (numStack.length === 2) {
    let num = operate(currVal, numStack[1], opStack[0]);
    if (isInt(num)) result.textContent = num;
    else result.textContent = parseFloat(num.toFixed(10));
  }
}

// shared functions

function decimalEvent() {
  decimal.classList.add("hit");
  if (canDec) {
    divByZero = false;
    if (canClear === true) {
      reset();
      canClear = false;
      working.textContent += decimal.textContent;
    } else if (
      working.textContent.slice(numIndex) === "" ||
      working.textContent.slice(numIndex) === "-"
    ) {
      working.textContent += `0.`;
      lengthenNum();
      previewResult();
    } else {
      working.textContent += decimal.textContent;
    }
    canDec = false;
  }
}

function deleteEvent() {
  del.classList.add("hit");
  console.log("deleting");
  if (canClear === true || working.textContent.length === 1) {
    console.log("cleared");
    reset();
    canClear = false;
    working.textContent += 0;
  } else if (numStack.length === 0 && opStack.length === 0) {
    if (working.textContent.charAt(working.textContent.length - 1) === ".")
      canDec = true;
  } else if (
    opIndex === working.textContent.length - 1 &&
    opHistory.length === 1
  ) {
    let temp = working.textContent;
    reset();
    working.textContent = temp;
    canDec =
      working.textContent.slice(numIndex).indexOf(".") === -1 ? true : false;
  } else if (opIndex === working.textContent.length - 1) {
    // Reset opstack and opIndex to what it was before op that was removed was placed
    opIndexHistory.pop();
    opHistory.pop();
    opIndex = opIndexHistory[opIndexHistory.length - 1];
    opStack.pop();
    if (opHistory.length !== 0) opStack.push(opHistory[opHistory.length - 1]);
    // revert numIndex and currVal to what they were before
    numIndexHistory.pop();
    numIndex = numIndexHistory[numIndexHistory.length - 1];
    numHistory.pop();
    currValHistory.pop();
    currVal = currValHistory[currValHistory.length - 1];
    // reset numStack when only one operand left since operation consists
    // of first element and the second inputted one which is taken by lengthenNum
    numStack.unshift(numHistory[numHistory.length - 1]);
    canDec =
      working.textContent.slice(numIndex).indexOf(".") === -1 ? true : false;
  } else {
    console.log("??");
    let number = working.textContent.slice(
      numIndex,
      working.textContent.length - 1
    );
    numStack.pop();
    if (number !== "") {
      numStack.push(number);
      if (number === "-") result.textContent = currVal;
      else previewResult();
    } else if (currValHistory.length >= 2) {
      result.textContent = currVal;
    } else result.textContent = "";
    if (working.textContent.charAt(working.textContent.length - 1) === ".")
      canDec = true;
  }
  working.textContent = working.textContent.slice(
    0,
    working.textContent.length - 1
  );
}

function equalsEvent() {
  equals.classList.add("hit");
  if (canClear === true) return;
  if (numStack.length < 2) return;
  if (working.textContent.slice(numIndex) === "-") return;
  else {
    let num = findNum();
    updateResult();
    let temp = result.textContent;
    reset();
    working.textContent = temp;
    canClear = true;
  }
}

function numberEvent(e) {
  console.log(parseFloat(e.key));
  numArray[parseFloat(e.key)].classList.add("hit");
  divByZero = false;
  if (canClear === true) {
    reset();
    canClear = false;
    working.textContent = e.key;
  } else if (working.textContent === "0") working.textContent = e.key;
  else {
    working.textContent += e.key;
    lengthenNum();
    previewResult();
  }
}

function opEvent(e) {
  let opString = e.key === "*" ? "x" : e.key;
  opObject[`${opString}`].classList.add("hit");
  if (divByZero === true) return;
  if (working.textContent.slice(numIndex) === "-") return;
  canClear = false;
  if (findNum() === "") {
    opIndexHistory.pop();
    opStack.pop();
    opHistory.pop();
    opIndex--;
    working.textContent = working.textContent.slice(
      0,
      working.textContent.length - 1
    );
    working.textContent += opString;
    opStack.push(opString);
    opHistory.push(opString);
  } else {
    working.textContent += opString;
    opStack.push(opString);
    opHistory.push(opString);
    updateResult();
  }
  if (divByZero === true) {
    let temp = result.textContent;
    reset();
    working.textContent = temp;
    canClear = true;
  }
}

function signEvent() {
  sign.classList.add("hit");
  if (divByZero === true) return;
  if (numIndex === working.textContent.length) {
    working.textContent += "-";
    numStack.push("-");
  } else if (working.textContent.charAt(numIndex) === "-") {
    console.log("true");
    let pre = working.textContent.slice(0, numIndex);
    let post = working.textContent.slice(numIndex + 1);
    console.log(pre);
    console.log(post);
    working.textContent = `${pre}${post}`;
    if (post === "") {
      numStack.pop();
      return;
    }
    lengthenNum();
    previewResult();
  } else {
    let pre = working.textContent.slice(0, numIndex);
    let post = working.textContent.slice(numIndex);
    working.textContent = `${pre}-${post}`;
    lengthenNum();
    previewResult();
  }
}

function clearHit() {
  divByZero = false;
  clear.classList.add("hit");
}

function removeStyling(e) {
  this.classList.remove("hit");
}

// shared functions

for (let num of numbers) {
  num.addEventListener("click", (e) => {
    console.log(e);
    num.classList.add("hit");
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
  num.addEventListener("transitionend", removeStyling);
}

for (let op of operators) {
  op.addEventListener("click", () => {
    op.classList.add("hit");
    if (divByZero === true) return;
    if (working.textContent.slice(numIndex) === "-") return;
    canClear = false;
    if (findNum() === "") {
      opIndexHistory.pop();
      opStack.pop();
      opHistory.pop();
      opIndex--;
      working.textContent = working.textContent.slice(
        0,
        working.textContent.length - 1
      );
      working.textContent += op.textContent;
      opStack.push(op.textContent);
      opHistory.push(op.textContent);
    } else {
      working.textContent += op.textContent;
      opStack.push(op.textContent);
      opHistory.push(op.textContent);
      updateResult();
    }
    if (divByZero === true) {
      let temp = result.textContent;
      reset();
      working.textContent = temp;
      canClear = true;
    }
  });
  op.addEventListener("transitionend", removeStyling);
}

clear.addEventListener("click", reset);
clear.addEventListener("click", clearHit);
clear.addEventListener("transitionend", removeStyling);

equals.addEventListener("click", equalsEvent);
equals.addEventListener("transitionend", removeStyling);

decimal.addEventListener("click", decimalEvent);
decimal.addEventListener("transitionend", removeStyling);

del.addEventListener("click", deleteEvent);
del.addEventListener("transitionend", removeStyling);

sign.addEventListener("click", signEvent);
sign.addEventListener("transitionend", removeStyling);


window.addEventListener("click", () => {
  working.scrollLeft += 20;
});

window.addEventListener("keydown", (e) => {
  console.log(e);
  switch (e.key) {
    case "0":
      console.log(`works for ${e.key}`);
      numberEvent(e);
      break;
    case "1":
      console.log(`works for ${e.key}`);
      numberEvent(e);
      break;
    case "2":
      console.log(`works for ${e.key}`);
      numberEvent(e);
      break;
    case "3":
      console.log(`works for ${e.key}`);
      numberEvent(e);
      break;
    case "4":
      console.log(`works for ${e.key}`);
      numberEvent(e);
      break;
    case "5":
      console.log(`works for ${e.key}`);
      numberEvent(e);
      break;
    case "6":
      console.log(`works for ${e.key}`);
      numberEvent(e);
      break;
    case "7":
      console.log(`works for ${e.key}`);
      numberEvent(e);
      break;
    case "8":
      console.log(`works for ${e.key}`);
      numberEvent(e);
      break;
    case "9":
      console.log(`works for ${e.key}`);
      numberEvent(e);
      break;
    case "+":
      console.log(`works for ${e.key}`);
      opEvent(e);
      break;
    case "-":
      console.log(`works for ${e.key}`);
      opEvent(e);
      break;
    case "x":
      console.log(`works for ${e.key}`);
      opEvent(e);
      break;
    case "*":
      console.log(`works for ${e.key}`);
      opEvent(e);
      break;
    case "/":
      console.log(`works for ${e.key}`);
      opEvent(e);
      break;
    case "=":
      console.log(`works for ${e.key}`);
      equalsEvent();
      break;
    case "Enter":
      equalsEvent();
      break;
    case "Backspace":
      console.log(`works for ${e.key}`);
      deleteEvent();
      break;
    case ".":
      console.log(`works for ${e.key}`);
      decimalEvent();
      break;
    case "c":
      console.log(`works for ${e.key}`);
      clearHit();
      reset();
      break;
    case "ArrowUp":
      console.log(`works for ${e.key}`);
      signEvent();
      break;
    default:
      console.log("error");
      break;
  }
  working.scrollLeft += 20;
});
