class TodoPage {
  constructor(page) {
    this.page = page;
    this.taskNameInput = page.getByLabel('Task name');
    this.dueDateInput = page.getByLabel('Due date');
    this.addTaskButton = page.getByRole('button', { name: 'Add Task' });
    this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async addTask(name, dueDate) {
    await this.taskNameInput.fill(name);
    if (dueDate) {
      await this.dueDateInput.fill(dueDate);
    }
    await this.addTaskButton.click();
  }

  async startEditFirstTask() {
    await this.page.getByRole('button', { name: 'Edit' }).first().click();
  }

  async saveEdit(name, dueDate) {
    await this.taskNameInput.fill(name);
    await this.dueDateInput.fill(dueDate || '');
    await this.saveChangesButton.click();
  }

  taskRow(name) {
    return this.page.locator('li').filter({ hasText: name });
  }
}

module.exports = { TodoPage };
