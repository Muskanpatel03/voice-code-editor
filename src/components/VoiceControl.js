import React from "react";

function VoiceControl({ setCode, runCode }) {
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.start();
    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript.toLowerCase();
      handleCommand(speech);
    };
  };

  const extractNumbers = (speech) => {
    const nums = speech.match(/\d+/g);
    return nums ? nums.map(Number) : [];
  };

  const handleCommand = (speech) => {
    const nums = extractNumbers(speech);

    // ─── Lookup table: [matchFn, handlerFn] ───────────────────────────────
    // matchFn  : (speech) => boolean
    // handlerFn: (setCode, runCode, nums) => void
    const commands = [
      // Basic
      [s => s.includes("hello world"),
        () => setCode(`console.log('Hello World');`)],

      [s => s.includes("clear"),
        () => setCode("")],

      [s => s.includes("new line"),
        () => setCode(p => p + "\n")],

      [s => s.includes("run code"),
        () => runCode()],

      [s => s.includes("team members") || s.includes("show team"),
        () => setCode(`
console.log("Team Members:");
console.log("Akanksha Prajapati");
console.log("Apoorwa Sachan");
console.log("Asha Kumari");
console.log("Muskan Patel");
`)],

      [s => s.includes("faculty") || s.includes("project guide"),
        () => setCode(`
console.log("Project Faculty:");
console.log("Mr. Sarvesh Patel");
`)],

      // Functions / console
      [s => s.includes("create function"),
        () => setCode(`\nfunction myFunction() {\n  \n}\n`)],

      [s => s.includes("console log"),
        () => setCode(p => p + "\nconsole.log();")],

      [s => s.includes("delete line"),
        () => setCode(p => { const lines = p.split("\n"); lines.pop(); return lines.join("\n"); })],

      // Control flow
      [s => s.includes("if condition"),
        () => setCode(`\nif (true) {\n  \n}\n`)],

      [s => s.includes("for loop"),
        () => setCode(`\nfor (let i = 0; i < n; i++) {\n  \n}\n`)],

      [s => s.includes("while loop"),
        () => setCode(`\nwhile (true) {\n  \n}\n`)],

      [s => s.includes("inside loop"),
        () => setCode(p => p.replace("}", "  console.log(i);\n}"))],

      // Variables
      [s => s.includes("let variable"),
        () => setCode(p => p + "\nlet a = 0;")],

      [s => s.includes("const variable"),
        () => setCode(p => p + "\nconst b = 0;")],

      // Math (order matters: check before generic includes)
      [s => s.includes("add") || s.includes("sum") || s.includes("plus"),
        () => nums.length >= 2 && setCode(`console.log(${nums.join(" + ")});`)],

      [s => s.includes("multiply") || s.includes("into"),
        () => nums.length >= 2 && setCode(`console.log(${nums.join(" * ")});`)],

      [s => s.includes("divide"),
        () => nums.length >= 2 && setCode(`console.log(${nums[0]} / ${nums[1]});`)],

      [s => s.includes("subtract") || s.includes("minus"),
        () => nums.length >= 2 && setCode(`console.log(${nums[0]} - ${nums[1]});`)],

      // Algorithms
      [s => s.includes("input sum"),
        () => setCode(`
const values = prompt("Enter numbers comma separated").split(",").map(Number);
const result = values.reduce((a,b)=>a+b,0);
console.log(result);
`)],

      [s => s.includes("palindrome"),
        () => setCode(`
let str = prompt("Enter string");
let rev = str.split("").reverse().join("");
console.log(str === rev ? "Palindrome" : "Not Palindrome");
`)],

      [s => s.includes("armstrong"),
        () => setCode(`
let num = Number(prompt("Enter number"));
let sum = 0, temp = num;
while(temp > 0){
  let rem = temp % 10;
  sum += rem * rem * rem;
  temp = Math.floor(temp / 10);
}
console.log(sum === num ? "Armstrong" : "Not Armstrong");
`)],

      [s => s.includes("calculator"),
        () => setCode(`
let a = Number(prompt("Enter first number"));
let b = Number(prompt("Enter second number"));
console.log("Add:", a + b);
console.log("Sub:", a - b);
console.log("Mul:", a * b);
console.log("Div:", a / b);
`)],

      [s => s.includes("timer"),
        () => setCode(`
let i = 0;
let timer = setInterval(()=>{
  console.log(i++);
  if(i === 5) clearInterval(timer);
},1000);
`)],

      // UI / DOM
      [s => s.includes("create website") || s.includes("demo website"),
        () => setCode(`
document.body.style.margin = "0";
document.body.style.fontFamily = "Arial";
document.body.style.background = "linear-gradient(135deg, #6a11cb, #2575fc)";
document.body.style.color = "white";
document.body.style.textAlign = "center";
const container = document.createElement("div");
container.style.marginTop = "100px";
const title = document.createElement("h1");
title.innerText = "Welcome 🎉";
const text = document.createElement("p");
text.innerText = "This website is created using JavaScript";
const btn = document.createElement("button");
btn.innerText = "Click Me";
btn.style.cssText = "padding:10px 15px;border:none;border-radius:6px;background:#ff9800;color:white;cursor:pointer";
btn.onclick = () => alert("Hello Team!");
container.append(title, text, btn);
document.body.appendChild(container);
`)],

      [s => s.includes("login"),
        () => setCode(`
document.body.innerHTML = "";
const container = document.createElement("div");
container.style.cssText = "width:300px;margin:100px auto;padding:20px;border:1px solid #0c2b7e;border-radius:10px;text-align:center;box-shadow:0 0 10px rgba(0,0,0,0.1)";
const title = document.createElement("h2");
title.innerText = "Login";
const user = document.createElement("input");
user.placeholder = "Username";
user.style.cssText = "margin:10px;padding:8px;width:90%";
const pass = document.createElement("input");
pass.placeholder = "Password";
pass.type = "password";
pass.style.cssText = "margin:10px;padding:8px;width:90%";
const btn = document.createElement("button");
btn.innerText = "Login";
btn.style.cssText = "padding:10px;margin-top:10px;width:100%;background:#4CAF50;color:white;border:none;cursor:pointer";
const result = document.createElement("p");
btn.onclick = () => {
  if(user.value === "admin" && pass.value === "1234"){
    result.innerText = "Login Successful ✅";
    result.style.color = "green";
  } else {
    result.innerText = "Invalid Credentials ❌";
    result.style.color = "red";
  }
};
container.append(title, user, pass, btn, result);
document.body.appendChild(container);
`)],

      [s => s.includes("register"),
        () => setCode(`
document.body.innerHTML = "";
const container = document.createElement("div");
container.style.cssText = "width:300px;margin:100px auto;padding:20px;border:1px solid #281097;border-radius:10px;text-align:center";
const title = document.createElement("h2");
title.innerText = "Register";
const user = document.createElement("input");
user.placeholder = "Username";
user.style.cssText = "margin:10px;padding:8px;width:90%";
const pass = document.createElement("input");
pass.placeholder = "Password";
pass.type = "password";
pass.style.cssText = "margin:10px;padding:8px;width:90%";
const btn = document.createElement("button");
btn.innerText = "Register";
btn.style.cssText = "padding:10px;width:100%;background:#4CAF50;color:white;border:none;border-radius:5px;cursor:pointer";const msg = document.createElement("p");
btn.onclick = () => { msg.innerText = "Registered Successfully 🎉"; msg.style.color = "green"; };
container.append(title, user, pass, btn, msg);
document.body.appendChild(container);
`)],

      [s => s.includes("alert"),
        () => setCode(`alert('Hello');`)],

      // Array operations
      [s => s.includes("create array"),
        () => setCode(`let arr = prompt("Enter values").split(",");`)],

      [s => s.includes("push element"),
        () => setCode(p => p + `\narr.push(prompt("Enter value"));`)],

      [s => s.includes("pop element"),
        () => setCode(p => p + `\narr.pop();`)],

      [s => s.includes("loop array"),
        () => setCode(p => p + `\narr.forEach(item => {\n  console.log(item);\n});\n`)],

      [s => s.includes("array length"),
        () => setCode(p => p + `\nconsole.log(arr.length);`)],

      [s => s.includes("find element"),
        () => setCode(p => p + `\nlet val = prompt("Enter value");\nconsole.log(arr.includes(val));`)],
    ];
    // ──────────────────────────────────────────────────────────────────────

    // Find and run the first matching command
    const match = commands.find(([matchFn]) => matchFn(speech));
    if (match) {
      match[1]();
    } else {
      setCode(p => p + "\n// " + speech); // fallback: append as comment
    }
  };

  return (
    <button className="voice-btn" onClick={startListening}>
      🎤 Speak
    </button>
  );
}

export default VoiceControl;