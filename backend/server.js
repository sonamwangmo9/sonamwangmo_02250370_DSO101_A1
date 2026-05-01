require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Database initialized");
  } catch (err) {
    console.error("DB init error:", err);
  }
};

initDB();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET all todos
app.get("/api/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// GET single todo
app.get("/api/todos/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

// POST create todo
app.post("/api/todos", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || title.trim() === "") return res.status(400).json({ error: "Title is required" });
    const result = await pool.query(
      "INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *",
      [title.trim(), description || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// PUT update todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const result = await pool.query(
      `UPDATE todos SET title = COALESCE($1, title), description = COALESCE($2, description),
       completed = COALESCE($3, completed), updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [title, description, completed, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// PATCH toggle complete
app.patch("/api/todos/:id/toggle", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE todos SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle todo" });
  }
});

// DELETE todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM todos WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted", todo: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));