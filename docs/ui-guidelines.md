# UI Guidelines

This document defines the core UI guidelines for the TODO app.

## 1. Component Library

- The UI must use Material components for all primary interface elements.
- Prefer reusable Material-based components over custom one-off controls.
- At minimum, use Material components for:
  - Buttons
  - Inputs
  - Task list items/cards
  - Dialogs or modals

## 2. Color Palette

Use a simple, consistent color palette throughout the app.

- Primary: `#1976D2` (blue)
- Secondary: `#2E7D32` (green)
- Background: `#F5F7FA` (light gray)
- Surface: `#FFFFFF` (white)
- Text (primary): `#1F2937` (dark slate)
- Error: `#D32F2F` (red)

Guidelines:

- Use primary color for key actions and active states.
- Use secondary color for supportive highlights.
- Keep contrast strong between text and background.

## 3. Button Styles

- Use contained/filled Material buttons for primary actions (for example, "Add Task", "Save").
- Use outlined Material buttons for secondary actions.
- Use text buttons only for low-priority actions.
- Keep button labels short and action-oriented.
- Keep button sizing and spacing consistent across screens.

## 4. Accessibility (Simple Baseline)

- All interactive elements must have accessible labels.
- All form fields must have visible labels (not placeholder-only).
- Ensure keyboard access for core actions:
  - Add task
  - Edit task
  - Save/cancel in forms
- Maintain readable contrast for text and controls.
- Provide visible focus styles for keyboard navigation.
