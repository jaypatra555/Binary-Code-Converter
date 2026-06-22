function goBack(){
    window.history.back();
}


let input = document.getElementById("input");
let from = document.getElementById("from");
let to = document.getElementById("to");
let result = document.getElementById("result");

function decimalToBCD(num) {
    return num.toString().split("")
        .map(d => Number(d).toString(2).padStart(4, "0"))
        .join(" ");
}

function BCDToDecimal(bcd) {

    if (bcd.length % 4 !== 0) {
        return NaN;
    }

    let decimal = "";

    for (let i = 0; i < bcd.length; i += 4) {

        let digit = parseInt(bcd.slice(i, i + 4), 2);

        if (digit > 9) {
            return NaN;
        }

        decimal += digit;
    }

    return decimal;
}
// function BCDToDecimal(bcd) {
//     return bcd.trim().split(/\s+/)
//         .map(g => parseInt(g, 2))
//         .join("");
// }

function binaryToGray(binary) {
    let gray = binary[0];

    for (let i = 1; i < binary.length; i++) {
        gray += binary[i - 1] ^ binary[i];
    }

    return gray;
}

function grayToBinary(gray) {
    let binary = gray[0];

    for (let i = 1; i < gray.length; i++) {
        binary += binary[i - 1] ^ gray[i];
    }

    return binary;
}

function convert() {
    let value = input.value.trim();
    let f = from.value;
    let t = to.value;

    if (value === "") {
        result.value = "";
        return;
    }

    let valid = true;

if (f === "binary" || f === "gray") {
    valid = /^[01]+$/.test(value);
}

else if (f === "octal") {
    valid = /^[0-7]+$/.test(value);
}

else if (f === "decimal") {
    valid = /^[0-9]+$/.test(value);
}

else if (f === "hexadecimal") {
    valid = /^[0-9A-Fa-f]+$/.test(value);
}

else if (f === "bcd") {
    valid = /^[01]+$/.test(value);
}

if (!valid) {
    alert("Invalid Input");
    input.value = "";
    result.value = "";
    return;
}

    try {
        let decimal;

        // From -> Decimal
        if (f === "binary")
            decimal = parseInt(value, 2);
        else if (f === "octal")
            decimal = parseInt(value, 8);
        else if (f === "decimal")
            decimal = parseInt(value, 10);
        else if (f === "hexadecimal")
            decimal = parseInt(value, 16);
        else if (f === "bcd")
            decimal = parseInt(BCDToDecimal(value), 10);
        else if (f === "gray")
            decimal = parseInt(grayToBinary(value), 2);

        if (isNaN(decimal)) {
            result.value = "Invalid Input";
            return;
        }

        // Decimal -> To
        if (t === "binary")
            result.value = decimal.toString(2);

        else if (t === "octal")
            result.value = decimal.toString(8);

        else if (t === "decimal")
            result.value = decimal;

        else if (t === "hexadecimal")
            result.value = decimal.toString(16).toUpperCase();

        else if (t === "bcd")
            result.value = decimalToBCD(decimal);

        else if (t === "gray")
            result.value = binaryToGray(decimal.toString(2));
    }
    catch {
        result.value = "Invalid Input";
    }
}

input.addEventListener("input", convert);
from.addEventListener("change", convert);
to.addEventListener("change", convert);


//input onujai button kaj korbe

let buttons = document.querySelectorAll(".key");

function updateButtons() {
    let system = from.value;

    let allowed = [];

    if (system === "binary" || system === "gray" || system === "bcd") {
        allowed = ["0", "1"];
    }

    else if (system === "octal") {
        allowed = ["0","1","2","3","4","5","6","7"];
    }

    else if (system === "decimal") {
        allowed = ["0","1","2","3","4","5","6","7","8","9"];
    }

    else if (system === "hexadecimal") {
        allowed = [
            "0","1","2","3","4","5","6","7","8","9",
            "A","B","C","D","E","F"
        ];
    }

    buttons.forEach(btn => {
        if (allowed.includes(btn.innerText)) {
            btn.disabled = false;
            btn.style.opacity = "1";
        } else {
            btn.disabled = true;
            btn.style.opacity = "0.4";
        }
    });
}

from.addEventListener("change", () => {
    updateButtons();
    convert();
});

updateButtons();

function addToDisplay(value) {
    input.value += value;
    input.scrollLeft = input.scrollWidth;//likha besi hole dandike scroll hobe
    convert();

    result.scrollLeft = result.scrollWidth;//likha besi hole dandike scroll hobe
}

function del() {
    input.value = input.value.slice(0, -1);
    convert();
}

function allClear() {
    input.value = "";
    result.value = "";
}