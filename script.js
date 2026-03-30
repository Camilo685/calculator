let numbers = document.querySelectorAll(".numb");
let symbols = document.querySelectorAll(".symb");
let display = document.querySelector("b");

document.addEventListener("keydown", (event) => {
    let keyName = event.key.toLowerCase();
    if (keyName == "/") event.preventDefault();
    else if (keyName == "enter") event.preventDefault();
    else if (keyName == "backspace") event.preventDefault();

    if (keyName == "*") keyName = "x";
    else if (keyName == "enter") keyName = "=";
    else if (keyName == "backspace") keyName = "←";

    if (numKeys.includes(keyName)) numbersProcessing(keyName);
    else if (symbKeys.includes(keyName)) symbolsProcessing(keyName);
});

numbers.forEach((but) => but.addEventListener(
    "click", 
    (e) => numbersProcessing(e.target.textContent)
));

symbols.forEach((but) => but.addEventListener(
    "click", 
    (e) => symbolsProcessing(e.target.textContent)
));

let numKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
let symbKeys = ["+", "-", "x", "/", "c", "=", ".", "←"];
let operationSymbols = ["x", "/", "-", "+"];
let last = "";
let tempExpression = "";
let expression = [];
let reset = false;
let currentDot = false;

function Calculator(){
    this.methods = {
        "-" : (a, b) => a - b,
        "+" : (a, b) => a + b,
        "x" : (a, b) => a * b,
        "/" : (a, b) => (b != 0) ? a / b : NaN,
    },
    this.calculate = (a, s, b) => this.methods[s](a, b)
}

function solveExpression (arrayExp){
    let newCalc = new Calculator();
    let result = 0;
    let index = null;

    let operation = () => {
        result = newCalc.calculate(
            +arrayExp[index - 1], 
            arrayExp[index], 
            +arrayExp[index + 1]
        );
        if (result == NaN) return NaN;
        arrayExp.splice(
            index - 1, 
            3, 
            result
        );
    }

    if (arrayExp.length == 1) return arrayExp[0]
    let symbCounter = 0;
    while (arrayExp.length != 1){
        while (arrayExp.includes(operationSymbols[symbCounter]) || arrayExp.includes(operationSymbols[symbCounter + 1])){
            let firstOpIndex = arrayExp.indexOf(operationSymbols[symbCounter]);
            let secOpIndex = arrayExp.indexOf(operationSymbols[symbCounter + 1]);
            
            if (firstOpIndex >= 0 && secOpIndex >= 0){
                index = (firstOpIndex < secOpIndex) ? firstOpIndex : secOpIndex;
            } else index = (firstOpIndex >= 0) ? firstOpIndex : secOpIndex;

            let tempResult = operation();
            if (tempResult == NaN) return NaN;
        }
        symbCounter += 2;
    }
    return Math.round(result * 10000) / 10000;
}

function numbersProcessing(numString){
    last = numString;
    if (!reset){
        display.textContent += last;
        tempExpression += last;
    } else {
        display.textContent = last;
        tempExpression = last;
        reset = false;
    }
    display.scrollTop = display.scrollHeight;
}

function symbolsProcessing(symbString){
    let clear = () => {
        expression.length = 0;
        tempExpression = "";
        last = "";
        display.textContent = "";
        currentDot = false;
        reset = false;
    }

    let addToTemp = function (appendTemp = false, appentDisplay = false) {
        last = symbString;
        tempExpression = (appendTemp == true ) ? tempExpression + last : last;
        display.textContent = (appentDisplay == true ) ? display.textContent + last : last;
    }

    let deleteLast = function (modTemp = true, newTemp = "", displayAppend = false, changeExpression = false) {
        console.log(changeExpression);
        if (modTemp) tempExpression = (newTemp) ? newTemp : tempExpression.slice(0, -1);
        if (changeExpression) expression.splice(-1, 1, symbString);
        last = tempExpression.slice(-1);
        display.textContent = (displayAppend) ? display.textContent.slice(0, -1) + symbString : display.textContent.slice(0, -1);
    }

    if (tempExpression == "NaN") clear();
    if (symbString == "c") clear();
    else if (expression.length == 0){
        if (!tempExpression){
            if (operationSymbols.includes(symbString)){
                if (symbString == "-" || symbString == "."){
                    if (symbString == ".") currentDot = true;
                    addToTemp();
                }
            }
        } else {
            if (operationSymbols.includes(symbString)){
                if (!isNaN(+tempExpression)){
                    if (last == ".") {
                        deleteLast(true, "", true);
                    } else display.textContent += symbString;
                    expression.push(tempExpression, symbString);
                    tempExpression = "";
                    currentDot = false;
                    last = symbString;
                    reset = false;
                }
            } else if (symbString == "."){
                if (reset) clear();
                if (!currentDot) {
                    currentDot = true;
                    addToTemp(true, true);
                }
            } else if (symbString == "←"){
                if (reset) clear();
                else{
                    if (last == ".") currentDot = false;
                    deleteLast();
                }
            }
        }
    } else {
        if (!tempExpression){
            if (operationSymbols.includes(symbString)){
                if (symbString == "-"){
                    if (last == "+"){
                        deleteLast(false, "", true, true);
                        last = symbString;
                    }
                    else {
                        addToTemp(false, true);
                    }
                } else {
                    deleteLast(false, "", true, true);
                    last = symbString;
                }
            } else if (symbString == "."){
                currentDot = true;
                addToTemp(false, true);
            } else if (symbString == "←"){
                expression.pop();
                deleteLast(true, expression.pop());
            }
        } else{
            if (operationSymbols.includes(symbString)){
                if (!isNaN(+tempExpression)){
                    if (last == ".") {
                        deleteLast(true, "", true);
                    } else display.textContent += symbString;
                    expression.push(tempExpression, symbString);
                    tempExpression = "";
                    currentDot = false;
                    last = symbString;
                    reset = false;
                }
            } else if (symbString == "."){
                if (!currentDot) {
                    currentDot = true;
                    addToTemp(true, true);
                }
            } else if (symbString == "←"){
                if (last == ".") currentDot = false;
                deleteLast()
            } else if (symbString == "="){
                if (!isNaN(+tempExpression)){
                    expression.push(tempExpression);
                    let result = solveExpression(expression);
                    expression.length = 0;
                    tempExpression = result + "";
                    last = tempExpression.slice(-1);
                    display.textContent = result;
                    if (tempExpression.includes(".")) currentDot = true;
                    else currentDot = false;
                    reset = true;
                }
            }
        }
    }
    display.scrollTop = display.scrollHeight;
}