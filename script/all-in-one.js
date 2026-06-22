function goBack(){
    window.history.back();
}


let num1 = document.getElementById("num1");
let num2 = document.getElementById("num2");

let base1 = document.getElementById("base1");
let base2 = document.getElementById("base2");

let operation = document.getElementById("operation");

let result = document.getElementById("result");
let resultBase = document.getElementById("resultBase");

let process = document.getElementById("process");

num1.addEventListener("input", () => {
    validate(num1, base1.value);
    calculate();
});

num2.addEventListener("input", () => {
    validate(num2, base2.value);
    calculate();
});

base1.addEventListener("change", () => {
    num1.value = "";
    process.innerHTML = "";
});

base2.addEventListener("change", () => {
    num2.value = "";
    process.innerHTML = "";
});

operation.addEventListener("change", calculate);
resultBase.addEventListener("change", calculate);

// ---------------- VALIDATION ----------------
function validate(input, base) {

    switch(base){

        case "binary":
        case "gray":
            input.value = input.value.replace(/[^01]/g,"");
            break;

        case "octal":
            input.value = input.value.replace(/[^0-7]/g,"");
            break;

        case "decimal":
            input.value = input.value.replace(/[^0-9]/g,"");
            break;

        case "hexadecimal":
            input.value = input.value.replace(/[^0-9a-fA-F]/g,"").toUpperCase();
            break;

        case "bcd":
        case "xs3":
            input.value = input.value.replace(/[^01 ]/g,"");
            break;
    }
}

// ---------------- MAIN CALC ----------------
function calculate() {

    if(!num1.value || !num2.value){
        result.value = "";
        process.innerHTML = "";
        return;
    }

    let n1 = convertToDecimal(num1.value, base1.value);
    let n2 = convertToDecimal(num2.value, base2.value);

    if(isNaN(n1) || isNaN(n2)){
        result.value = "Invalid";
        return;
    }

    let ans;

    switch(operation.value){

        case "+": ans = n1 + n2; break;
        case "-": ans = n1 - n2; break;
        case "*": ans = n1 * n2; break;

        case "/":
            if(n2 === 0){
                result.value = "Error";
                return;
            }
            ans = n1 / n2;
            break;
    }

    ans = Math.floor(ans);

    result.value = convertFromDecimal(ans, resultBase.value);

    let p1 = getProcess(num1.value, base1.value);
    let p2 = getProcess(num2.value, base2.value);
    let pres = getResultProcess(ans, resultBase.value);

    process.innerHTML = `
    <b>NUMBER 1</b><br>${p1}<br><br>

    <b>NUMBER 2</b><br>${p2}<br><br>

    <b>CALCULATION</b><br>
    ${n1} ${operation.value} ${n2} = ${ans}<br><br>

    <b>RESULT CONVERSION</b><br>
    ${pres}
    `;
}

// ---------------- CONVERT TO DECIMAL ----------------
function convertToDecimal(value, base) {

    if(!value) return NaN;

    switch(base){

        case "binary":
            return parseInt(value,2);

        case "octal":
            return parseInt(value,8);

        case "decimal":
            return parseInt(value,10);

        case "hexadecimal":
            return parseInt(value,16);

        case "bcd":
            return BCDToDecimal(value);

        case "xs3":
            return XS3ToDecimal(value);

        case "gray":
            return parseInt(grayToBinary(value),2);
    }
}

// ---------------- CONVERT FROM DECIMAL ----------------
function convertFromDecimal(value, base) {

    switch(base){

        case "binary":
            return value.toString(2);

        case "octal":
            return value.toString(8);

        case "decimal":
            return value.toString(10);

        case "hexadecimal":
            return value.toString(16).toUpperCase();

        case "bcd":
            return decimalToBCD(value);

        case "xs3":
            return decimalToXS3(value);

        case "gray":
            return binaryToGray(value.toString(2));
    }
}

// ---------------- PROCESS ENGINE ----------------
function getProcess(value, base) {

    if(!value) return "";

    switch(base){

        case "binary":
            return powerProcess(value, 2, "Binary");

        case "octal":
            return powerProcess(value, 8, "Octal");

        case "hexadecimal":
            return hexProcess(value);

        case "decimal":
            return `${value}₁₀`;

        case "bcd":
            return bcdProcess(value);

        case "xs3":
            return xs3Process(value);

        case "gray":
            return grayProcess(value);
    }
}

// --------- POWER METHOD (binary/octal) ----------
function powerProcess(value, base, name){

    value = String(value).toUpperCase();

    let len = value.length;

    let terms = [];
    let values = [];
    let sum = 0;

    for(let i = 0; i < len; i++){

        let char = value[i];

        // ✅ PERFECT DIGIT FIX (HEX + ALL BASE SAFE)
        let digit;

        if(char >= '0' && char <= '9'){
            digit = char - '0';
        }
        else{
            digit = char.charCodeAt(0) - 55; // A=10, B=11...
        }

        let power = len - i - 1;

        let calc = digit * Math.pow(base, power);
        sum += calc;

        terms.push(`(${digit}×${base}<sup>${power}</sup>)`);
        values.push(calc);
    }

    return `
    <b>${name} Conversion</b><br><br>

    ${value}<br><br>

    = ${terms.join(" + ")}<br>
    = ${values.join(" + ")}<br>
    = ${sum}₁₀
    `;
}
// --------- HEX PROCESS ----------
function hexProcess(value){

    let len = value.length;
    let steps = [];
    let sum = 0;

    for(let i=0;i<len;i++){

        let digit = value[i].toUpperCase();
        let num = parseInt(digit,16);
        let power = len - i - 1;

        let calc = num * Math.pow(16,power);
        sum += calc;

        steps.push(`${digit} × 16^${power} = ${calc}`);
    }

    return `
    <b>Hexadecimal Conversion</b><br>
    ${value}<br><br>
    ${steps.join("<br>")}<br><br>
    = ${sum}₁₀
    `;
}

// --------- BCD ----------
function bcdProcess(value){

    let groups = value.trim().split(" ");
    let digits = [];

    let steps = groups.map(g=>{
        let d = parseInt(g,2);
        digits.push(d);
        return `${g} = ${d}`;
    });

    return `
    <b>BCD Conversion</b><br>
    ${value}<br><br>
    ${steps.join("<br>")}<br><br>
    = ${digits.join("")}₁₀
    `;
}

// --------- XS3 ----------
function xs3Process(value){

    let groups = value.trim().split(" ");
    let digits = [];

    let steps = groups.map(g=>{
        let d = parseInt(g,2);
        let r = d - 3;
        digits.push(r);
        return `${g} = ${d} → ${r}`;
    });

    return `
    <b>XS-3 Conversion</b><br>
    ${value}<br><br>
    ${steps.join("<br>")}<br><br>
    = ${digits.join("")}₁₀
    `;
}

// --------- GRAY ----------
function grayProcess(value){

    let binary = grayToBinary(value);
    return `
    <b>Gray Code</b><br>
    Gray: ${value}<br>
    Binary: ${binary}<br>
    Decimal: ${parseInt(binary,2)}
    `;
}

// --------- RESULT PROCESS ----------
function getResultProcess(value, base){

    let num = Number(value);

    // ---------------- DECIMAL ----------------
    if(base === "decimal"){
        return `${num}₁₀`;
    }

    // ---------------- BINARY / OCTAL / HEX ----------------
    if(base === "binary" || base === "octal" || base === "hexadecimal"){

        let targetBase =
            base === "binary" ? 2 :
            base === "octal" ? 8 : 16;

        let str = num.toString(targetBase).toUpperCase();
        let len = str.length;

        let terms = [];
        let sums = [];

        for(let i = 0; i < len; i++){

            let char = str[i];
            let digit = parseInt(char, 36);
            let power = len - i - 1;

            let calc = digit * Math.pow(targetBase, power);

            terms.push(`(${digit}×${targetBase}<sup>${power}</sup>)`);
            sums.push(calc);
        }

        return `
        <b>Result Conversion</b><br><br>

        ${num}₁₀ → ${str}<sub>${targetBase}</sub><br><br>

        = ${terms.join(" + ")}<br>
        = ${sums.join(" + ")}<br>
        = ${str}
        `;
    }

    // ---------------- BCD ----------------
    if(base === "bcd"){

        let str = num.toString();
        let groups = str.split("");

        let steps = groups.map(d => {
            let bin = Number(d).toString(2).padStart(4,"0");
            return `${d} → ${bin}`;
        });

        let result = groups.map(d =>
            Number(d).toString(2).padStart(4,"0")
        ).join(" ");

        return `
        <b>Result Conversion (BCD)</b><br><br>

        ${num}₁₀ → ${result}<br><br>

        ${steps.join("<br>")}
        `;
    }

    // ---------------- XS-3 ----------------
    if(base === "xs3"){

        let str = num.toString();
        let groups = str.split("");

        let steps = groups.map(d => {
            let val = Number(d);
            let enc = val + 3;
            let bin = enc.toString(2).padStart(4,"0");
            return `${d} + 3 = ${enc} → ${bin}`;
        });

        let result = groups.map(d =>
            (Number(d)+3).toString(2).padStart(4,"0")
        ).join(" ");

        return `
        <b>Result Conversion (XS-3)</b><br><br>

        ${num}₁₀ → ${result}<br><br>

        ${steps.join("<br>")}
        `;
    }

    // ---------------- GRAY CODE ----------------
    if(base === "gray"){

        let binary = num.toString(2);

        let gray = binary[0];

        let steps = [`MSB = ${binary[0]}`];

        for(let i = 1; i < binary.length; i++){

            let g = Number(binary[i-1]) ^ Number(binary[i]);
            gray += g;

            steps.push(`${binary[i-1]} XOR ${binary[i]} = ${g}`);
        }

        return `
        <b>Result Conversion (Gray Code)</b><br><br>

        Binary: ${binary}<br>
        Gray: ${gray}<br><br>

        ${steps.join("<br>")}
        `;
    }
}

// --------- HELPERS ----------
function decimalToBCD(num){
    return num.toString().split("")
    .map(d=>Number(d).toString(2).padStart(4,"0"))
    .join(" ");
}

function BCDToDecimal(bcd){
    return Number(
        bcd.replace(/\s+/g,"")
        .match(/.{1,4}/g)
        .map(g=>parseInt(g,2))
        .join("")
    );
}

function decimalToXS3(num){
    return num.toString().split("")
    .map(d=>(Number(d)+3).toString(2).padStart(4,"0"))
    .join(" ");
}

function XS3ToDecimal(xs3){
    return Number(
        xs3.replace(/\s+/g,"")
        .match(/.{1,4}/g)
        .map(g=>parseInt(g,2)-3)
        .join("")
    );
}

function binaryToGray(binary){
    let gray = binary[0];
    for(let i=1;i<binary.length;i++){
        gray += binary[i-1] ^ binary[i];
    }
    return gray;
}

function grayToBinary(gray){
    let binary = gray[0];
    for(let i=1;i<gray.length;i++){
        binary += binary[i-1] ^ gray[i];
    }
    return binary;
}