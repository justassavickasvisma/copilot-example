---
description: Debug and fix bugs with systematic root cause analysis
mode: agent
---

# Bug Fix

Investigate and fix the bug described in ${input:bugDescription:Describe the bug and how to reproduce it}.

## Debugging Process

### 1. Reproduce the Issue
- Understand the expected vs. actual behavior
- Identify steps to consistently reproduce the bug
- Gather error messages, stack traces, and logs

### 2. Analyze the Problem
- Examine ${selection} or ${file} for potential issues
- Review recent changes that might have introduced the bug
- Check related files and dependencies
- Identify the scope of impact (which users/features are affected)

### 3. Root Cause Investigation
- Form hypotheses about what's causing the issue
- Test hypotheses systematically, starting with most likely
- Trace the execution flow to pinpoint where things go wrong
- Check for common bug patterns:
  - Null/undefined values
  - Off-by-one errors
  - Race conditions
  - Incorrect assumptions
  - Edge cases not handled

### 4. Implement Fix
- Make the minimal change necessary to fix the root cause
- Avoid fixing symptoms while leaving the root cause unaddressed
- Ensure the fix doesn't introduce new issues
- Add defensive code to prevent similar bugs

### 5. Verify Solution
- Test that the bug is fixed
- Verify no regressions were introduced
- Test edge cases
- Consider adding automated tests

## Output Format

Provide:

### Bug Analysis
- **Summary**: Description of the bug in your own words
- **Severity**: Critical/High/Medium/Low
- **Root Cause**: What's actually causing the issue
- **Impact**: What systems/users are affected

### Solution
- **Fix**: Specific code changes needed
- **Files to Modify**: List of files that need changes
- **Code Example**: Show the fix with before/after code
- **Explanation**: Why this fix addresses the root cause

### Testing
- **Verification Steps**: How to confirm the fix works
- **Test Cases**: Suggested tests to prevent regression
- **Edge Cases**: Additional scenarios to test

### Prevention
- **Similar Bugs**: Check for similar issues elsewhere
- **Best Practices**: How to avoid this type of bug in the future

Be methodical and focus on root causes, not just symptoms.
