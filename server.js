// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

const express = require("express");
const path = require("path");
const notesData = require("./db/db.json");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// ==============================================================================

// Tells node that we are creating an "express" server
const app = express();

// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond
// when users visit or request data from various URLs.
// ================================================================================

// API Routes
// GET
app.get("/api/notes", (req, res) => {
  res.json(notesData);
});

// POST
app.post("/api/notes", (req, res) => {
  const note = req.body;
  note.id = uuidv4(); // Add unique ID to note
  notesData.push(note);

  // Write JSON DB file
  fs.writeFile("./db/db.json", JSON.stringify(notesData), err => {
    if (err) throw err;
    else res.json(notesData); // Render new note
  })
});

// DELETE
app.delete("/api/notes/:id", (req, res) => {
  
});

// HTML Routes
// Notes Route
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// If no matching route is found default to index
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================

app.listen(PORT, (req, res) => {
  console.log(`App running on http://localhost:${PORT}`);
});
