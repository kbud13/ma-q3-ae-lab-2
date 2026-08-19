# Coding Guidelines

This document summarizes the coding style and quality principles for the TODO app. The goal is to keep the codebase consistent, easy to read, and straightforward to maintain as features are added.

## Style and Formatting

Use clear, predictable formatting across backend and frontend code. Keep indentation, spacing, and line breaks consistent within each file and follow established project patterns rather than introducing one-off styles. Prefer descriptive names for variables, functions, and components so intent is obvious without extra explanation. Keep functions focused on a single responsibility and avoid large blocks of deeply nested logic.

## Conventions and Structure

Match naming and file organization to the existing project layout. Place backend code in the backend package and frontend code in the frontend package, and keep related tests close to the areas they validate. Favor small reusable modules over monolithic files. When adding new features, extend existing patterns first unless there is a strong reason to introduce a new approach.

## Import Organization

Keep imports organized and stable. Group external library imports before local project imports, and keep import ordering consistent within a file. Remove unused imports promptly and avoid circular dependencies between modules. Prefer explicit imports so dependencies are easy to trace during review.

## Code Quality Principles

Follow the DRY principle: avoid repeating the same logic in multiple places when it can be extracted into a shared utility or reusable component. Balance DRY with readability by avoiding abstractions that make simple code harder to understand. Write code that is easy to test and refactor by minimizing hidden side effects and using clear input/output behavior.

## Linting and Best Practices

Use a linter as part of normal development to enforce consistent style and catch common issues early. Run lint checks before committing changes, and fix warnings that indicate maintainability or correctness risks. Keep changes scoped, readable, and review-friendly, and ensure new code includes appropriate test coverage aligned with the project testing guidelines.
