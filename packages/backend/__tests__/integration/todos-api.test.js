const request = require('supertest');
const { app, db } = require('../../src/app');

beforeEach(() => {
  db.exec('DELETE FROM items');
});

describe('TODO API integration', () => {
  test('creates and returns a task with due date', async () => {
    const response = await request(app)
      .post('/api/items')
      .send({ name: 'Write report', dueDate: '2026-08-20' });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Write report');
    expect(response.body.due_date).toBe('2026-08-20');
  });

  test('updates task name and due date', async () => {
    const created = await request(app)
      .post('/api/items')
      .send({ name: 'Old name', dueDate: '2026-08-21' });

    const updated = await request(app)
      .put(`/api/items/${created.body.id}`)
      .send({ name: 'New name', dueDate: '2026-08-22' });

    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe('New name');
    expect(updated.body.due_date).toBe('2026-08-22');
  });

  test('returns sorted tasks by due date then id', async () => {
    await request(app).post('/api/items').send({ name: 'No due date' });
    await request(app).post('/api/items').send({ name: 'Later', dueDate: '2026-09-01' });
    await request(app).post('/api/items').send({ name: 'Sooner', dueDate: '2026-08-25' });

    const response = await request(app).get('/api/items');

    expect(response.status).toBe(200);
    expect(response.body.map((item) => item.name)).toEqual(['Sooner', 'Later', 'No due date']);
  });
});
