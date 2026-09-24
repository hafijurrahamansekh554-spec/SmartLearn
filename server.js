const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

// Render-এর PORT ব্যবহার করবে, আর local computer-এ 3000 ব্যবহার করবে
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// তোমার HTML, CSS, JS files serve করবে
app.use(express.static(__dirname));

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "SmartLearn server is running"
  });
});

// AI Tutor API
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    // Message check
    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    // API key check
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured."
      });
    }

    // OpenAI request
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are SmartLearn AI Tutor. Explain programming and computer science topics in very simple language for college students. Give clear examples when useful."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "No AI response received."
      });
    }

    res.json({
      reply: reply
    });

  } catch (error) {
    console.error("AI Tutor Error:", error);

    res.status(500).json({
      error: "AI response failed. Please check the server configuration."
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("SmartLearn page not found.");
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SmartLearn server running on port ${PORT}`);
});