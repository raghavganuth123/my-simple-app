const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Health check (for ECS)
app.get("/health", (req, res) => {
    res.json({ status: "healthy", message: "App running for Raghav Ganesan" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
