let numbers = document.querySelectorAll(".numb");
let symbols = document.querySelectorAll(".symb");
let display = document.querySelector("b");

let last = "";
let expression = "";
let reset = false;

function Calculator(){
    this.methods = {
        "-" : (a, b) => a - b,
        "+" : (a, b) => a + b,
        "x" : (a, b) => a * b,
        "/" : (a, b) => a / b,
    },
    this.calculate = (a, s, b) => this.methods[s](a, b)
}

function solveExpression (expression = ""){
    let arrayExp = expression.split(" ");
    let symbolArray = ["x", "/", "+", "-"];
    let newCalc = new Calculator();
    let result = 0;
    for (let symb of symbolArray){
        while (arrayExp.includes(symb)){
            console.log(symb);
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

numbers.forEach((but) => {
    but.addEventListener("click", (e) => {
        if (!reset){
            display.textContent += e.target.textContent;
            last = e.target.textContent;
            expression += last;
            console.log(expression);
        } else {
            display.textContent = e.target.textContent;
            last = e.target.textContent;
            expression = last;
        }
    })
})

symbols.forEach((but) => {
    but.addEventListener("click", (e) => {
        if (last){
            let symb = e.target.textContent
            display.textContent += symb;
            if (symb == "+" || symb == "-" || symb == "x" || symb == "/"){
                reset = false;
                if (!isNaN(+last)){
                    last = e.target.textContent;
                    expression += " " + last + " ";
                } else {
                    last = e.target.textContent;
                    expression = expression.slice(0, -3) + " " + last + " ";
                }
            } else {
                if (symb == "="){
                    let result = solveExpression(expression);
                    last = result + "";
                    expression = last;
                    display.textContent = expression;
                    reset = true;
                } else if (symb == "c"){
                    expression = "";
                    last = "";
                    display.textContent = "";
                }
            }
        }
    })
})