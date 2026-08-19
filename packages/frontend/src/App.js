import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const sortedItems = [...data].sort((a, b) => {
    if (!a.due_date && !b.due_date) {
      return a.id - b.id;
    }
    if (!a.due_date) {
      return 1;
    }
    if (!b.due_date) {
      return -1;
    }
    const byDueDate = a.due_date.localeCompare(b.due_date);
    if (byDueDate !== 0) {
      return byDueDate;
    }
    return a.id - b.id;
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      const response = await fetch(editingId ? `/api/items/${editingId}` : '/api/items', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newItem,
          dueDate: newDueDate,
        }),
      });

      if (!response.ok) {
        throw new Error(editingId ? 'Failed to update item' : 'Failed to add item');
      }

      const result = await response.json();
      if (editingId) {
        setData(data.map(item => (item.id === editingId ? result : item)));
      } else {
        setData([...data, result]);
      }
      setNewItem('');
      setNewDueDate('');
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError((editingId ? 'Error updating item: ' : 'Error adding item: ') + err.message);
      console.error('Error saving item:', err);
    }
  };

  const handleEdit = (item) => {
    setNewItem(item.name);
    setNewDueDate(item.due_date || '');
    setEditingId(item.id);
  };

  const handleCancelEdit = () => {
    setNewItem('');
    setNewDueDate('');
    setEditingId(null);
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setData(data.filter(item => item.id !== itemId));
      setError(null);
    } catch (err) {
      setError('Error deleting item: ' + err.message);
      console.error('Error deleting item:', err);
    }
  };

  return (
    <Container maxWidth="md" className="app-root">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1">TODO App</Typography>
          <Typography variant="body1" color="text.secondary">
            Add, edit, and organize tasks with optional due dates.
          </Typography>
        </Stack>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" component="h2">
          {editingId ? 'Edit Task' : 'Add Task'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Task name"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter task"
              fullWidth
              required
            />
            <TextField
              label="Due date"
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              {editingId ? 'Save Changes' : 'Add Task'}
            </Button>
            {editingId && (
              <Button variant="outlined" type="button" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mt: 3, mb: 4 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Tasks (sorted by due date, then creation order)
        </Typography>
        {loading && <Typography>Loading data...</Typography>}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <List>
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <ListItem
                  key={item.id}
                  className="task-item"
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Button
                        type="button"
                        variant="outlined"
                        size="small"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="text"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={item.name}
                    secondary={item.due_date ? `Due: ${item.due_date}` : 'No due date'}
                  />
                  {item.due_date && <Chip label="Scheduled" size="small" color="primary" />}
                </ListItem>
              ))
            ) : (
              <Typography>No tasks found. Add one to get started.</Typography>
            )}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default App;