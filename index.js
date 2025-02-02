require("dotenv").config();

const fs = require("fs-extra");
const multer = require("multer");
const express = require("express");
const { Level } = require("level");

const db = new Level("./data", { valueEncoding: "json" });
const app = express();
app.use(express.json());

// Middleware: Load API key from env variable
app.use((req, res, next) => {
  const authKey = req.headers["x-api-key"];
  if (authKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// Upload file handling
const upload = multer({ dest: "uploads/" });

// 📌 Get all keys
app.get("/keys", async (req, res) => {
  let keys = [];
  for await (const key of db.keys()) {
    keys.push(key);
  }
  res.json(keys);
});

// 📌 Get a single key-value
app.get("/get/:key", async (req, res) => {
  try {
    const value = await db.get(req.params.key);
    res.json({ key: req.params.key, value });
  } catch (err) {
    res.status(404).json({ error: "Key not found" });
  }
});

// 📌 Write key-value pair
app.post("/set", async (req, res) => {
  const { key, value } = req.body;
  try {
    await db.put(key, value);
    res.json({ message: `Stored: ${key} -> ${value}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Delete a key
app.delete("/delete/:key", async (req, res) => {
  try {
    await db.del(req.params.key);
    res.json({ message: `Deleted ${req.params.key}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Delete all keys (Flush DB)
app.delete("/flush", async (req, res) => {
  try {
    await db.clear();
    res.json({ message: "Database flushed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Download database as JSON
app.get("/download", async (req, res) => {
  let data = {};
  for await (const [key, value] of db.iterator()) {
    data[key] = value;
  }

  const filePath = "./db_export.json";
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));

  res.download(filePath, "database.json", () => {
    fs.unlinkSync(filePath); // Delete after sending
  });
});

// 📌 Upload & Import JSON data to LevelDB
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const data = await fs.readJson(filePath);

    for (const [key, value] of Object.entries(data)) {
      await db.put(key, value);
    }

    await fs.unlink(filePath); // Cleanup
    res.json({ message: "Data imported successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 6378;
app.listen(PORT, () => console.log(`LevelDB API running on port ${PORT}`));
