const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(__dirname));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Health check
app.get("/health", (req, res) => {
    res.status(200).send("SmartLearn is running!");
});

// Render-এর PORT ব্যবহার করবে
const PORT = process.env.PORT || 10000;

// 0.0.0.0-তে server চালু
app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartLearn server running on port ${PORT}`);
});