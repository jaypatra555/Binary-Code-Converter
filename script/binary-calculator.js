function goBack(){
    window.history.back();
}

function addToDisplay(value){
    display.value += value;

    let len = display.value.length;

    if(len > 10){
        display.style.fontSize = "10vw";
    }
    if(len > 15){
        display.style.fontSize = "8vw";
}

    display.scrollLeft = display.scrollWidth;
}

// function addToDisplay(value){
//     display.value += value;
// }

function clearDisplay(){
    display.value = "";
    result.innerText = "";
    display.style.fontSize = "14vw";
}

// function clearDisplay(){
//     display.value = "";
//     result.innerText="";
// }

function del(){
    display.value = display.value.slice(0,-1);

    let len = display.value.length;

    if (len > 15) {
        display.style.fontSize = "8vw";
    }
    else if (len > 10) {
        display.style.fontSize = "10vw";
    }
    else {
        display.style.fontSize = "14vw";
    }
}

function calculate(){

    let exp = display.value;

    let decimalExp = exp.replace(/[01]+/g,function(match){
        return parseInt(match,2);
    });

    let result = eval(decimalExp);

    document.getElementById("result").innerText=+result.toString(2);

    result.scrollLeft = result.scrollWidth;

}