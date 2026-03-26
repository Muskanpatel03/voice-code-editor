import React from "react";

function VoiceControl({ setCode }) {

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

  // 🔥 Extract numbers for dynamic math
  const extractNumbers = (speech) => {
    const nums = speech.match(/\d+/g);
    return nums ? nums.map(Number) : [];
  };

  const handleCommand = (speech) => {

    // 🔹 BASIC
    if (speech.includes("hello world")) {
      setCode((prev) => prev + "\nconsole.log('Hello World');");
    }

    else if (speech.includes("clear")) {
      setCode("");
    }

    else if (speech.includes("new line")) {
      setCode((prev) => prev + "\n");
    }

    // 🔹 FUNCTION
    else if (speech.includes("create function")) {
      setCode((prev) => prev + "\nfunction myFunction() {\n  \n}");
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
      setCode((prev) => prev + "\nif (true) {\n  \n}");
    }

    // 🔹 LOOPS
    else if (speech.includes("for loop")) {
      setCode((prev) => prev + "\nfor (let i = 0; i < 10; i++) {\n  \n}");
    }

    else if (speech.includes("while loop")) {
      setCode((prev) => prev + "\nwhile (true) {\n  \n}");
    }

    // 🔹 VARIABLES
    else if (speech.includes("let variable")) {
      setCode((prev) => prev + "\nlet a = 0;");
    }

    else if (speech.includes("const variable")) {
      setCode((prev) => prev + "\nconst b = 0;");
    }

    // 🔥 STATIC MATH (FOR TESTING)
    else if (speech.includes("sum")) {
      setCode((prev) => prev + "\nconsole.log(5 + 3);");
    }

    else if (speech.includes("addition")) {
      setCode((prev) => prev + "\nconsole.log(10 + 20);");
    }

    else if (speech.includes("subtract")) {
      setCode((prev) => prev + "\nconsole.log(10 - 5);");
    }

    else if (speech.includes("multiply")) {
      setCode((prev) => prev + "\nconsole.log(5 * 4);");
    }

    else if (speech.includes("division")) {
      setCode((prev) => prev + "\nconsole.log(20 / 4);");
    }

    // 🔥 DYNAMIC MATH (SMART FEATURE)
    else if (speech.includes("add")) {
      const nums = extractNumbers(speech);
      if (nums.length >= 2) {
        setCode((prev) => prev + `\nconsole.log(${nums[0]} + ${nums[1]});`);
      }
    }

    else if (speech.includes("multiply") || speech.includes("into")) {
      const nums = extractNumbers(speech);
      if (nums.length >= 2) {
        setCode((prev) => prev + `\nconsole.log(${nums[0]} * ${nums[1]});`);
      }
    }

    else if (speech.includes("divide")) {
      const nums = extractNumbers(speech);
      if (nums.length >= 2) {
        setCode((prev) => prev + `\nconsole.log(${nums[0]} / ${nums[1]});`);
      }
    }

    else if (speech.includes("minus") || speech.includes("subtract")) {
      const nums = extractNumbers(speech);
      if (nums.length >= 2) {
        setCode((prev) => prev + `\nconsole.log(${nums[0]} - ${nums[1]});`);
      }
    }

    // 🔹 SUM FUNCTION
    else if (speech.includes("sum function")) {
      setCode((prev) => prev + `
function sum(a, b) {
  return a + b;
}
console.log(sum(5, 3));
`);
    }

    // 🔹 ALERT
    else if (speech.includes("alert")) {
      setCode((prev) => prev + "\nalert('Hello');");
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