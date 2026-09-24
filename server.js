const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

// ========================================
// PORT
// Local computer: 3000
// Render: Render-এর দেওয়া PORT
// ========================================
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARE
// ========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SmartLearn-এর HTML, CSS, JS files
app.use(express.static(__dirname));

// ========================================
// OPENAI
// ========================================
let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// ========================================
// HOME PAGE
// ========================================
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// ========================================
// HEALTH CHECK
// ========================================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    project: "SmartLearn",
    message: "SmartLearn server is running"
  });
});

// ========================================
// SERVER STATUS
// ========================================
app.get("/api/status", (req, res) => {
  res.json({
    server: "online",
    aiTutor: openai ? "configured" : "not configured"
  });
});

// ========================================
// AI TUTOR
// ========================================
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    // Check message
    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    // Check OpenAI API
    if (!openai) {
      return res.status(503).json({
        error:
          "AI Tutor is not configured yet. Please add OPENAI_API_KEY in Render Environment Variables."
      });
    }

    // Ask AI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content:
            "You are SmartLearn AI Tutor. You help college students learn programming, computer science, mathematics, web development, and technology. Explain concepts clearly and simply. Give examples when useful. Be friendly and educational."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply =
      response.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    res.status(200).json({
      reply: reply
    });

  } catch (error) {
    console.error("AI Tutor Error:", error);

    res.status(500).json({
      error:
        "Sorry, I could not get an AI response. Please try again later."
    });
  }
});

// ========================================
// 404 PAGE
// ========================================
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SmartLearn - Page Not Found</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f5f7fb;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }

        .box {
          background: white;
          padding: 40px;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        h1 {
          color: #333;
        }

        p {
          color: #666;
        }

        a {
          display: inline-block;
          margin-top: 15px;
          padding: 12px 20px;
          background: #6c5ce7;
          color: white;
          text-decoration: none;
          border-radius: 8px;
        }
      </style>
    </head>

    <body>
      <div class="box">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The SmartLearn page you are looking for does not exist.</p>
        <a href="/">Go to SmartLearn Home</a>
      </div>
    </body>
    </html>
  `);
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SmartLearn server running on port ${PORT}`);
});