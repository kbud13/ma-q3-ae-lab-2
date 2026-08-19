const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isValidDueDate = (value) => {
  if (value === undefined || value === null || value === '') {
    return true;
  }

  if (typeof value !== 'string' || !DATE_ONLY_REGEX.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    due_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial data
const initialItems = ['Item 1', 'Item 2', 'Item 3'];
const insertStmt = db.prepare('INSERT INTO items (name, due_date) VALUES (?, ?)');
const getByIdStmt = db.prepare('SELECT * FROM items WHERE id = ?');
const listItemsStmt = db.prepare(`
  SELECT *
  FROM items
  ORDER BY (due_date IS NULL) ASC, due_date ASC, created_at ASC, id ASC
`);
const updateStmt = db.prepare(`
  UPDATE items
  SET
    name = ?,
    due_date = ?,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);
const deleteStmt = db.prepare('DELETE FROM items WHERE id = ?');

initialItems.forEach(item => {
  insertStmt.run(item, null);
});

console.log('In-memory database initialized with sample data');

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// API Routes
app.get('/api/items', (req, res) => {
  try {
    const items = listItemsStmt.all();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', (req, res) => {
  try {
    const { name, dueDate } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }

    if (!isValidDueDate(dueDate)) {
      return res.status(400).json({ error: 'Due date must be in YYYY-MM-DD format' });
    }

    const normalizedDueDate = dueDate || null;

    const result = insertStmt.run(name.trim(), normalizedDueDate);
    const id = result.lastInsertRowid;

    const newItem = getByIdStmt.get(id);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.put('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, dueDate } = req.body;

    if (!id || Number.isNaN(parseInt(id, 10))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const existingItem = getByIdStmt.get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return res.status(400).json({ error: 'Item name cannot be empty' });
    }

    if (!isValidDueDate(dueDate)) {
      return res.status(400).json({ error: 'Due date must be in YYYY-MM-DD format' });
    }

    const nextName = name !== undefined ? name.trim() : existingItem.name;
    const nextDueDate = dueDate !== undefined ? (dueDate || null) : existingItem.due_date;

    updateStmt.run(nextName, nextDueDate, id);
    const updatedItem = getByIdStmt.get(id);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.delete('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const existingItem = getByIdStmt.get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      res.json({ message: 'Item deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = { app, db, insertStmt, isValidDueDate };