// Simple TaskFlow API (in-memory)
// Endpoints: GET/POST/PUT/DELETE /api/tasks

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// In-memory storage (в реале это будет БД)
let tasks = []; // {id, title, description, dueDate, completed}

// Health
app.get("/", (req, res) => {
  res.send("🚀 TaskFlow API is running!");
});

// List tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Create task
app.post("/api/tasks", (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const task = {
    id: Date.now().toString(),
    title: title.trim(),
    description: (description || "").trim(),
    dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    completed: false,
  };
  tasks.push(task);
  res.status(201).json(task);
});

// Update task (full/partial)
app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  const patch = req.body || {};
  tasks[idx] = {
    ...tasks[idx],
    ...(patch.title !== undefined ? { title: patch.title } : {}),
    ...(patch.description !== undefined ? { description: patch.description } : {}),
    ...(patch.dueDate !== undefined
      ? { dueDate: patch.dueDate ? new Date(patch.dueDate).toISOString() : null }
      : {}),
    ...(patch.completed !== undefined ? { completed: !!patch.completed } : {}),
  };
  res.json(tasks[idx]);
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const existed = tasks.some(t => t.id === id);
  tasks = tasks.filter(t => t.id !== id);
  if (!existed) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`🌍 API running at http://localhost:${PORT}`);
});
