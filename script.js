let numbers = document.querySelectorAll(".numb");
let symbols = document.querySelectorAll(".symb");
let display = document.querySelector("b");

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
        "/" : (a, b) => a / b,
    },
    this.calculate = (a, s, b) => this.methods[s](a, b)
}

function solveExpression (arrayExp){
    let symbolArray = ["x", "/", "+", "-"];
    let newCalc = new Calculator();
    let result = 0;
    if (arrayExp.length == 1) return arrayExp[0]
    for (let symb of symbolArray){
        while (arrayExp.includes(symb)){
            let index = arrayExp.indexOf(symb);
            result = newCalc.calculate(
                +arrayExp[index - 1], 
                arrayExp[index], 
                +arrayExp[index + 1]
            );
            arrayExp.splice(
                index - 1, 
                3, 
                result
            );
        }
    }
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
    }
    if (last){
        if (symbString == "+" || symbString == "-" || symbString == "x" || symbString == "/"){
            reset = false;
            if (!isNaN(+last) || last == "."){
                if (last == ".") {
                    if (tempExpression.length > 1){
                        tempExpression = tempExpression.slice(0, -1);
                        display.textContent = display.textContent.slice(0, -1) + symbString;
                    } else return;
                } else display.textContent += symbString;
                expression.push(tempExpression, symbString);
                tempExpression = "";
                
            } else {
                expression.splice(-1, 1, symbString);
                display.textContent = display.textContent.slice(0, -1) + symbString;
            }
            last = symbString;
        } else {
            if (symbString == "="){
                if(tempExpression.length == 1 && last == ".") clear()
                else if (!isNaN(+tempExpression)){
                    expression.push(tempExpression);
                    let result = solveExpression(expression);
                    expression.length = 0;
                    tempExpression = result + "";
                    last = tempExpression.slice(-1);
                    display.textContent = result;
                    reset = true;
                }
            } else if (symbString == "c") clear()
            else if (symbString == "←"){
                if (expression || tempExpression){
                    display.textContent = display.textContent.slice(0, -1);
                    let lastValue = () => {
                        if (last == ".") {
                            currentDot = false;
                        }
                        last = tempExpression.slice(-1);
                        tempExpression = tempExpression.slice(0, -1);
                    }
                    if (tempExpression) lastValue()
                    else {
                        let tempPop = expression.pop()
                        if (tempPop.length == 1){
                            if (expression){
                                tempExpression = expression.pop();
                                last = tempExpression.slice(-1);
                            } else clear();
                        } else lastValue;
                    }
                }
            } else if(symbString == "."){
                if (!tempExpression || (tempExpression && !currentDot)){
                    last = symbString;
                    tempExpression += last;
                    display.textContent = last;
                    currentDot = true;
                } 
            }
        }
    }
}