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

  // 🔢 Extract numbers
  const extractNumbers = (speech) => {
    const nums = speech.match(/\d+/g);
    return nums ? nums.map(Number) : [];
  };

  const handleCommand = (speech) => {
    const nums = extractNumbers(speech);

    // 🔹 BASIC
    if (speech.includes("hello world")) {
      setCode(`console.log('Hello World');`);
    } else if (speech.includes("clear")) {
      setCode("");
    } else if (speech.includes("new line")) {
      setCode((prev) => prev + "\n");
    } else if (speech.includes("run code")) {
      runCode();
    } else if (
      speech.includes("team members") ||
      speech.includes("show team")
    ) {
      setCode(`
console.log("Team Members:");
console.log("Akanksha Prajapati");
console.log("Apoorwa Sachan");
console.log("Asha Kumari");
console.log("Muskan Patel");
`);
    } else if (speech.includes("faculty") || speech.includes("project guide")) {
      setCode(`
console.log("Project Faculty:");
console.log("Mr. Sarvesh Patel");
`);
    }

    // 🔹 FUNCTION
    else if (speech.includes("create function")) {
      setCode(`
function myFunction() {
  
}
`);
    }

    // 🔹 CONSOLE
    else if (speech.includes("console log")) {
      setCode((prev) => prev + "\nconsole.log();");
    }

    // 🔹 DELETE LAST LINE
    else if (speech.includes("delete line")) {
      setCode((prev) => {
        const lines = prev.split("\n");
        lines.pop();
        return lines.join("\n");
      });
    }

    // 🔹 CONDITIONS
    else if (speech.includes("if condition")) {
      setCode(`
if (true) {
  
}
`);
    }

    // 🔹 LOOPS
    else if (speech.includes("for loop")) {
      setCode(`
for (let i = 0; i < n; i++) {
  
}
`);
    } else if (speech.includes("while loop")) {
      setCode(`
while (true) {
  
}
`);
    }

    // 🔹 WRITE INSIDE LOOP
    else if (speech.includes("inside loop")) {
      setCode((prev) => prev.replace("}", "  console.log(i);\n}"));
    }

    // 🔹 VARIABLES
    else if (speech.includes("let variable")) {
      setCode((prev) => prev + "\nlet a = 0;");
    } else if (speech.includes("const variable")) {
      setCode((prev) => prev + "\nconst b = 0;");
    }

    // 🔥 DYNAMIC MATH
    else if (
      speech.includes("add") ||
      speech.includes("sum") ||
      speech.includes("plus")
    ) {
      if (nums.length >= 2) {
        setCode(`console.log(${nums.join(" + ")});`);
      }
    } else if (speech.includes("multiply") || speech.includes("into")) {
      if (nums.length >= 2) {
        setCode(`console.log(${nums.join(" * ")});`);
      }
    } else if (speech.includes("divide")) {
      if (nums.length >= 2) {
        setCode(`console.log(${nums[0]} / ${nums[1]});`);
      }
    } else if (speech.includes("subtract") || speech.includes("minus")) {
      if (nums.length >= 2) {
        setCode(`console.log(${nums[0]} - ${nums[1]});`);
      }
    }

    // 🔥 INPUT BASED CALCULATION
    else if (speech.includes("input sum")) {
      setCode(`
const values = prompt("Enter numbers comma separated").split(",").map(Number);
const result = values.reduce((a,b)=>a+b,0);
console.log(result);
`);
    }

    // 🔥 PALINDROME
    else if (speech.includes("palindrome")) {
      setCode(`
let str = prompt("Enter string");
let rev = str.split("").reverse().join("");
console.log(str === rev ? "Palindrome" : "Not Palindrome");
`);
    }

    // 🔥 ARMSTRONG
    else if (speech.includes("armstrong")) {
      setCode(`
let num = Number(prompt("Enter number"));
let sum = 0;
let temp = num;

while(temp > 0){
  let rem = temp % 10;
  sum += rem * rem * rem;
  temp = Math.floor(temp / 10);
}

console.log(sum === num ? "Armstrong" : "Not Armstrong");
`);
    }

    // 🔥 SIMPLE CALCULATOR
    else if (speech.includes("calculator")) {
      setCode(`
let a = Number(prompt("Enter first number"));
let b = Number(prompt("Enter second number"));
console.log("Add:", a + b);
console.log("Sub:", a - b);
console.log("Mul:", a * b);
console.log("Div:", a / b);
`);
    }

    // 🔥 TIMER
    else if (speech.includes("timer")) {
      setCode(`
let i = 0;
let timer = setInterval(()=>{
  console.log(i++);
  if(i === 5) clearInterval(timer);
},1000);
`);
    }

    // 🔥 SIMPLE WEBSITE
    else if (speech.includes("create website") || speech.includes("demo website")) {
  setCode(`
<!DOCTYPE html>
<html>
<head>
  <title>Demo Website</title>
  <style>
    body {
      margin: 0;
      font-family: Arial;
      background: linear-gradient(135deg, #6a11cb, #2575fc);
      color: white;
      text-align: center;
    }
    .card {
      margin-top: 100px;
      background: rgba(255,255,255,0.1);
      padding: 20px;
      border-radius: 12px;
      display: inline-block;
    }
    button {
      padding: 10px 15px;
      border: none;
      border-radius: 6px;
      background: #ff9800;
      color: white;
      cursor: pointer;
    }
    button:hover {
      background: #e68900;
    }
  </style>
</head>
<body>

  <div class="card">
    <h1>Welcome 🎉</h1>
    <p>This is my voice controlled project</p>
    <button onclick="alert('Hello Muskan!')">Click Me</button>
  </div>

</body>
</html>
`);
}

    // 🔹 ALERT
    else if (speech.includes("alert")) {
      setCode(`alert('Hello');`);
    }

    // 🔹 DEFAULT
    else {
      setCode((prev) => prev + "\n// " + speech);
    }
  };

  return (
    <button className="voice-btn" onClick={startListening}>
      🎤 Speak
    </button>
  );
}

export default VoiceControl;
