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
  });

  test('user can edit an existing task', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTask('Draft notes', '2026-08-26');
    await todoPage.startEditFirstTask();
    await todoPage.saveEdit('Draft release notes', '2026-08-27');

    await expect(todoPage.taskRow('Draft release notes')).toBeVisible();
    await expect(page.getByText('Due: 2026-08-27')).toBeVisible();
  });
});
