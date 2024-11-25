# Coding Style Guide

This document outlines the coding standards for the AI Resume Analyzer project.

## Python (Backend)

1. **Naming Conventions**:
   - Functions and variables: `snake_case`
   - Classes: `PascalCase`
   - Constants: `UPPER_CASE`

2. **Formatting**:
   - Use **4 spaces** for indentation.
   - Limit lines to **80 characters** where possible.
   - Place imports at the top of the file.

3. **Comments and Docstrings**:
   - Use docstrings for functions, classes, and modules.
   - Inline comments should be concise and explain why (not what).

## JavaScript (Frontend)

1. **Naming Conventions**:
   - Variables and functions: `camelCase`
   - React components: `PascalCase`
   - Constants: `UPPER_CASE`

2. **Formatting**:
   - Use **2 spaces** for indentation.
   - Place imports at the top of the file and group by source.
   - Limit lines to **100 characters** where possible.

3. **Comments**:
   - Use comments sparingly to clarify complex logic.

4. **React Guidelines**:
   - Use functional components.
   - Maintain component-focused organization (one component per file).
   - Use **PropTypes** for type-checking props in components.

## Testing Standards

- Follow the Arrange-Act-Assert pattern in tests.
- Write clear and descriptive test names.
- Aim for comprehensive coverage of all key features.