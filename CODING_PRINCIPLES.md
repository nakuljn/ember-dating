# Emberly Coding Principles

## Core Principles

Throughout the development of the Emberly dating app, we adhere to these fundamental principles:

### 1. KISS - Keep It Simple, Stupid

- Write clear, straightforward code that's easy to understand
- Favor readability over clever solutions
- Break complex problems into smaller, manageable parts
- Use descriptive variable/function names
- If a function exceeds 20-30 lines, consider breaking it down

### 2. YAGNI - You Aren't Gonna Need It

- Don't implement features until they're actually needed
- Focus on MVP requirements first
- Avoid premature optimization
- Don't over-engineer solutions for hypothetical future needs
- Add complexity only when justified by concrete requirements

### 3. DRY - Don't Repeat Yourself

- Extract duplicate code into reusable functions or classes
- Create shared utilities for common operations
- Use inheritance and composition appropriately
- Maintain single sources of truth for business logic
- Use constants for values used in multiple places

## Practical Application

- **Frontend**: Create reusable components rather than duplicating UI code
- **Backend**: Use repository pattern to centralize database operations
- **Testing**: Utilize fixtures and helper functions to avoid test boilerplate
- **Configuration**: Centralize configuration values and reference them
- **Documentation**: Document once, reference many times 