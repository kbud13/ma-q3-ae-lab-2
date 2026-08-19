const { isValidDueDate } = require('../src/app');

describe('due date validation', () => {
  test('accepts valid due date', () => {
    expect(isValidDueDate('2026-12-31')).toBe(true);
  });

  test('accepts empty due date', () => {
    expect(isValidDueDate('')).toBe(true);
    expect(isValidDueDate(null)).toBe(true);
    expect(isValidDueDate(undefined)).toBe(true);
  });

  test('rejects invalid due date formats', () => {
    expect(isValidDueDate('12-31-2026')).toBe(false);
    expect(isValidDueDate('2026/12/31')).toBe(false);
    expect(isValidDueDate('not-a-date')).toBe(false);
  });
});
