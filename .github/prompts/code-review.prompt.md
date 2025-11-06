---
description: Perform thorough code review for quality, security, and best practices
mode: agent
---

# Code Review

Review ${selection} for code quality, security, performance, and adherence to best practices.

## Review Checklist

Analyze the code for:

### Code Quality
- **Readability**: Clear variable names, logical structure, appropriate comments
- **Maintainability**: Modular design, DRY principles, separation of concerns
- **Standards**: Follows project conventions and coding standards
- **Complexity**: Identify overly complex code that could be simplified

### Security
- **Vulnerabilities**: SQL injection, XSS, authentication issues, data exposure
- **Input Validation**: Proper sanitization and validation of user input
- **Error Handling**: Secure error messages that don't leak sensitive information

### Performance
- **Bottlenecks**: Inefficient algorithms, unnecessary computations
- **Resource Usage**: Memory leaks, excessive database queries
- **Optimization**: Opportunities for caching or lazy loading

### Testing
- **Coverage**: Are critical paths tested?
- **Edge Cases**: Are boundary conditions handled?
- **Test Quality**: Are tests meaningful and maintainable?

## Output Format

Provide:

### Summary
Brief overview of the code's purpose and overall quality assessment.

### Critical Issues
Security vulnerabilities, bugs, or breaking changes that must be addressed.

### Recommended Improvements
- **Priority**: High/Medium/Low
- **Location**: Specific line numbers or functions
- **Issue**: What needs improvement
- **Suggestion**: Concrete solution with code examples
- **Rationale**: Why this change matters

### Positive Feedback
Highlight well-written code, good patterns, and best practices used.

### Questions
Ask for clarification on unclear intent or design decisions.

Be constructive, specific, and educational in your feedback.
