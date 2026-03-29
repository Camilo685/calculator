let numbers = document.querySelectorAll(".numb");
let symbols = document.querySelectorAll(".symb");
let display = document.querySelector("b");

let last = "";
let tempExpression = "";
let expression = [];
let operationSymbols = ["x", "/", "-", "+"];
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
    // for (let symb of operationSymbols){
    //     while (arrayExp.includes(symb)){
    //         let index = arrayExp.indexOf(symb);
    //         result = newCalc.calculate(
    //             +arrayExp[index - 1], 
    //             arrayExp[index], 
    //             +arrayExp[index + 1]
    //         );
    //         if (result == NaN) return NaN;
    //         arrayExp.splice(
    //             index - 1, 
    //             3, 
    //             result
    //         );
    //     }
    // }
    return result;
}

numbers.forEach((but) => but.addEventListener(
    "click", 
    (e) => numbersProcessing(e.target.textContent)
));

symbols.forEach((but) => but.addEventListener(
    "click", 
    (e) => symbolsProcessing(e.target.textContent)
));

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

    if (tempExpression == "NaN") clear();
    if (symbString == "c") clear();
    else if (expression.length == 0){
        if (!tempExpression){
            if (operationSymbols.includes(symbString)){
                if (symbString == "-" || symbString == "."){
                    if (symbString == ".") currentDot = true;
                    last = symbString;
                    tempExpression = symbString;
                    display.textContent = symbString;
                }
            }
        } else {
            if (operationSymbols.includes(symbString)){
                if (!isNaN(+tempExpression)){
                    if (last == ".") {
                        tempExpression = tempExpression.slice(0, -1);
                        display.textContent = display.textContent.slice(0, -1) + symbString;
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
                    last = symbString;
                    tempExpression += symbString;
                    display.textContent += symbString;
                }
            } else if (symbString == "←"){
                if (reset) clear();
                else{
                    if (last == ".") currentDot = false;
                    tempExpression = tempExpression.slice(0, -1);
                    last = tempExpression.slice(-1);
                    display.textContent = display.textContent.slice(0, -1);
                }
            }
        }
    } else {
        if (!tempExpression){
            if (operationSymbols.includes(symbString)){
                if (symbString == "-"){
                    if (last == "+"){
                        expression.splice(-1, 1, symbString);
                        display.textContent = display.textContent.slice(0, -1) + symbString;
                        last = symbString;
                    }
                    else {
                        last = symbString;
                        tempExpression = symbString;
                        display.textContent += symbString;
                    }
                } else {
                    expression.splice(-1, 1, symbString);
                    display.textContent = display.textContent.slice(0, -1) + symbString;
                    last = symbString;
                }
            } else if (symbString == "."){
                currentDot = true;
                last = symbString;
                tempExpression = symbString;
                display.textContent = symbString;
            } else if (symbString == "←"){
                expression.pop();
                tempExpression = expression.pop();
                last = tempExpression.slice(-1);
                display.textContent = display.textContent.slice(0, -1);
            }
        } else{
            if (operationSymbols.includes(symbString)){
                if (!isNaN(+tempExpression)){
                    if (last == ".") {
                        tempExpression = tempExpression.slice(0, -1);
                        display.textContent = display.textContent.slice(0, -1) + symbString;
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
                    last = symbString;
                    tempExpression += symbString;
                    display.textContent += symbString;
                }
            } else if (symbString == "←"){
                if (last == ".") currentDot = false;
                tempExpression = tempExpression.slice(0, -1);
                last = tempExpression.slice(-1);
                display.textContent = display.textContent.slice(0, -1);
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
}