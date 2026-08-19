const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('TODO workflow', () => {
  test.beforeEach(async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await expect(page.getByText('TODO App')).toBeVisible();
  });

  test('user can add a task with a due date', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTask('Plan sprint', '2026-08-23');

    await expect(todoPage.taskRow('Plan sprint')).toBeVisible();
    await expect(page.getByText('Due: 2026-08-23')).toBeVisible();

    const apiResponse = await page.request.get('/api/items');
    const tasks = await apiResponse.json();
    const createdTask = tasks.find((task) => task.name === 'Plan sprint');
    expect(createdTask).toBeTruthy();
    expect(createdTask.due_date).toBe('2026-08-23');
  });

  test('user can edit an existing task', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTask('Draft notes', '2026-08-26');
    await todoPage.startEditFirstTask();
    await todoPage.saveEdit('Draft release notes', '2026-08-27');

    await expect(todoPage.taskRow('Draft release notes')).toBeVisible();
    await expect(page.getByText('Due: 2026-08-27')).toBeVisible();

    const apiResponse = await page.request.get('/api/items');
    const tasks = await apiResponse.json();
    const editedTask = tasks.find((task) => task.name === 'Draft release notes');
    expect(editedTask).toBeTruthy();
    expect(editedTask.due_date).toBe('2026-08-27');
  });
});
