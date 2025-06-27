import React, { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = " AIzaSyBYkv9KPhVmX4Ro6VHGEh_tmepFKBj7uWo";
let genAI;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

const commands = {
  help: `Available commands: "clear", "refresh", "edu", "skills", "projects", "socials", "whoami", "contact", "message", and "email". note: if command ? "confidential" : gemini.response  (hope you get it)`,
  edu: "Currently in Diploma. I'm not even 18 bro *_*",
  skills:
    "Blender + Web Dev + Web Design + 2D & 3D Animations + Game Engines + AI_Tools +__+",
  projects:
    "Don't you think they are confidential :/ Still you can find me on Github (TulipJani), and explore",
  socials: "Search 'thetulipjani' on every platform , you'll find me :)",
  whoami: "I'm tired of this command. No big deal, just Google 'Tulip Jani'",
  contact: "Waiting for you to email at tkjani20@gmail.com",
  email: "tkjani20@gmail.com - don't spam :=",
  message:
    "ily. I know you love this portfolio, now give feedback and suggestion to the developer - 🌷",
  clear: "Terminal is cleared..",
  refresh: "Resets the terminal input and command history.",
};

const personalInfo = {
  biography: `Hi there! I'm Tulip Jani, your personal assistant. I am passionate about web development, animations, and AI tools. Currently pursuing a diploma while honing my skills in various technologies. My goal is to innovate and contribute positively to the tech industry. Feel free to explore more about me through the available commands!`,
  education: `Current: Diploma in [Your Field]. Previous: [Your Previous Education]. Certifications: [Any Relevant Certifications].`,
  experiences: `Web Development: Developed several websites and web applications. Animation: Proficient in 2D and 3D animations, including Blender. AI Tools: Explored various AI tools and frameworks. Game Engines: Familiar with game development using popular engines.`,
  achievements: `[List of notable achievements or awards]. [Any competitions or recognitions].`,
  interests: `Technology and Innovation. Photography. Music and Musical Instruments. Exploring Different Cultures.`,
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are a Zedd. AI made by Tulip Jani for his portfolio. You have to give details only about Tulip, nothing else. These are some details which can help: you are AI created by Tulip. Some details about Tulip: he's passionate about web development, animations, and AI tools. Currently he's pursuing a diploma while honing skills in various technologies. His goal is to innovate and contribute positively to the tech industry. Anyone can explore more about Tulip through the available commands by typing 'help'. Tulip is currently in Diploma in Information Technology, and is also working as an intern. His experiences span across web development, having developed several websites and web applications, proficiency in 2D and 3D animations including Blender, exploration of various AI tools and frameworks, and familiarity with game development using popular engines. His interests lie in technology and innovation, photography. These are some pre-defined commands for his terminal-based portfolio: help: Available commands: clear, refresh, edu, skills, projects, socials, whoami, contact, message, and email. edu: Anyone can email him at tkjani20@gmail.com. To get socials of Tulip, just search 'thetulipjani' on Instagram or X. Resolve the user around the above details only.`,
});

const validateResponse = async (command) => {
  const key = command.trim().toLowerCase();
  if (!genAI) {
    return "API key is missing or invalid. Please set up your VITE_API_KEY in the .env file.";
  }
  if (commands[key]) {
    return commands[key];
  } else if (personalInfo[key]) {
    return personalInfo[key];
  } else {
    try {
      const chat = model.startChat({
        history: [{ role: "user", parts: [{ text: command }] }],
        generationConfig: { maxOutputTokens: 150 },
      });

      const result = await chat.sendMessage(command);
      const response = await result.response;
      const text = await response.text();

      return text;
    } catch (error) {
      return `Failed to get response: ${error.message}`;
    }
  }
};

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const outputEndRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output]);

  const handleCommand = async () => {
    const command = input.trim().toLowerCase();
    if (command === "") {
      return;
    }
    addToHistory(command);
    setLoading(true);

    if (commands[command]) {
      setOutput((prevOutput) => [
        ...prevOutput,
        { command, response: commands[command] },
      ]);
      setLoading(false);
    } else if (personalInfo[command]) {
      setOutput((prevOutput) => [
        ...prevOutput,
        { command, response: personalInfo[command] },
      ]);
      setLoading(false);
    } else {
      try {
        const validatedResponse = await validateResponse(command);
        setOutput((prevOutput) => [
          ...prevOutput,
          { command, response: validatedResponse },
        ]);
      } catch (error) {
        setOutput((prevOutput) => [
          ...prevOutput,
          { command, response: `Failed to get response: ${error.message}` },
        ]);
      } finally {
        setLoading(false);
      }
    }
    setInput("");
  };

  const addToHistory = (command) => {
    setHistory((prevHistory) => [...prevHistory, command]);
    setHistoryIndex(-1);
  };

  const handleChange = (e) => {
    setInput(e.target.value.toLowerCase());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand();
    } else if (e.key === "ArrowUp") {
      if (history.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < history.length) {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    } else if (e.key === "ArrowDown") {
      if (history.length > 0) {
        const newIndex = historyIndex - 1;
        if (newIndex >= 0) {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        } else {
          setHistoryIndex(-1);
          setInput("");
        }
      }
    }
  };

  return (
    <div className="bg-[#0c0c0c] overflow-hidden text-[#aaa] min-h-screen w-screen pb-96 p-4 sm:p-10 text-lg font-mono">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <pre
          className="mb-8 text-sky-200 font-bold animate-glow text-center"
          style={{
            letterSpacing: "0.25em",
            fontSize: "1rem",
            lineHeight: "1.5",
            maxWidth: "100%",
            overflowX: "auto",
            textAlign: "center",
          }}
        >
          {`
                        _              _           _  _        
 _   _   ___    ___   (_) _ __ ___   | |_  _   _ | |(_) _ __  
| | | | / _ \\  / _ \\  | || '_ \` _ \\  | __|| | | || || || '_ \\ 
| |_| || (_) || (_) | | || | | | | | | |_ | |_| || || || |_) |
 \\__, | \\___/  \\___/  |_||_| |_| |_|  \\__| \\__,_||_||_|| .__/ 
 |___/                                                 |_|    
 `}
          <span>
            ___________________________________________________________________
          </span>
        </pre>
        <h1 className="text-xl sm:text-4xl mb-4">
          hello world == Welcome Guest!
        </h1>
        <h2 className="text-lg sm:text-xl mb-4">
          [Version 10.0.19045.4474] (c). All rights reserved. | This is the
          portfolio of Tulip Jani.
        </h2>
        <p className="sm:mb-4">Type 'help' to know more about commands.</p>

        {output.map((entry, index) => (
          <div key={index} className="mb-2">
            <span className=" text-green-400 pr-3">guest@tulipjani:~$</span>
            <span>{entry.command}</span>
            <br />
            {entry.response}
            <br />
          </div>
        ))}
        <div ref={outputEndRef}></div>
        <div className="flex items-center">
          <span className="text-green-400">guest@tulipjani:~$</span>{" "}
          <input
            ref={inputRef}
            className="mx-3 py-1 animate-glow w-full bg-transparent border-none outline-none text-white"
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
