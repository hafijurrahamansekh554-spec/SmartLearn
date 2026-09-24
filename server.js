const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {

    try {

        const message = req.body.message;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

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

        const reply =
            response.choices[0].message.content;

        res.json({
            reply: reply
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "AI response failed. Please check the API key and server."
        });

    }

});

app.listen(PORT, () => {

    console.log(
        `SmartLearn server running at http://localhost:${PORT}`
    );

});