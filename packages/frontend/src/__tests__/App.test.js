import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

let items = [];

const server = setupServer(
  rest.get('/api/items', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(items));
  }),

  rest.post('/api/items', (req, res, ctx) => {
    const { name, dueDate } = req.body;

    if (!name || name.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Item name is required' }));
    }

    const created = {
      id: items.length + 1,
      name,
      due_date: dueDate || null,
      created_at: new Date().toISOString(),
    };
    items.push(created);

    return res(ctx.status(201), ctx.json(created));
  }),

  rest.put('/api/items/:id', async (req, res, ctx) => {
    const id = Number(req.params.id);
    const { name, dueDate } = req.body;
    const existing = items.find((item) => item.id === id);

    if (!existing) {
      return res(ctx.status(404), ctx.json({ error: 'Item not found' }));
    }

    existing.name = name;
    existing.due_date = dueDate || null;

    return res(ctx.status(200), ctx.json(existing));
  }),

  rest.delete('/api/items/:id', (req, res, ctx) => {
    const id = Number(req.params.id);
    items = items.filter((item) => item.id !== id);

    return res(
      ctx.status(200),
      ctx.json({ message: 'Item deleted successfully', id })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  items = [
    { id: 1, name: 'Write docs', due_date: '2026-08-20', created_at: '2026-08-19T10:00:00.000Z' },
    { id: 2, name: 'Review code', due_date: null, created_at: '2026-08-19T11:00:00.000Z' },
  ];
  server.resetHandlers();
});
afterAll(() => server.close());

beforeEach(() => {
  items = [
    { id: 1, name: 'Write docs', due_date: '2026-08-20', created_at: '2026-08-19T10:00:00.000Z' },
    { id: 2, name: 'Review code', due_date: null, created_at: '2026-08-19T11:00:00.000Z' },
  ];
});

describe('App Component', () => {
  test('renders the header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('TODO App')).toBeInTheDocument();
    expect(screen.getByText('Add, edit, and organize tasks with optional due dates.')).toBeInTheDocument();
  });

  test('loads and displays items', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Initially shows loading state
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Write docs')).toBeInTheDocument();
      expect(screen.getByText('Review code')).toBeInTheDocument();
    });
  });

  test('adds a new item', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Fill in the form and submit
    const input = screen.getByPlaceholderText('Enter task');
    await act(async () => {
      await user.type(input, 'New Test Task');
    });

    const dueDateInput = screen.getByLabelText(/Due date/i);
    await act(async () => {
      await user.type(dueDateInput, '2026-08-21');
    });
    
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    await act(async () => {
      await user.click(submitButton);
    });
    
    // Check that the new item appears
    await waitFor(() => {
      expect(screen.getByText('New Test Task')).toBeInTheDocument();
      expect(screen.getByText('Due: 2026-08-21')).toBeInTheDocument();
    });

    expect(input).toHaveValue('');
    expect(dueDateInput).toHaveValue('');
  });

  test('edits an existing item', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Write docs')).toBeInTheDocument();
    });

    await act(async () => {
      await user.click(screen.getAllByText('Edit')[0]);
    });

    const input = screen.getByPlaceholderText('Enter task');
    await act(async () => {
      await user.clear(input);
      await user.type(input, 'Write final docs');
    });

    await act(async () => {
      await user.click(screen.getByText('Save Changes'));
    });

    await waitFor(() => {
      expect(screen.getByText('Write final docs')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no items', async () => {
    // Override the default handler to return empty array
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText('No tasks found. Add one to get started.')).toBeInTheDocument();
    });
  });
});