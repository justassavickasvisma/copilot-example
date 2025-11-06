---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

# Frontend Development Instructions

## Overview
This file contains specific guidelines for TypeScript, JavaScript, React (TSX/JSX) development within this project.

## TSX-Specific Guidelines

### Component Declaration
- Always use TypeScript interfaces or types for component props
- Prefer `React.FC<PropsType>` or explicit return type annotation
- Use generic types when creating reusable components

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant, onClick, children, disabled = false }) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### Type Definitions
- Define interfaces for all component props
- Use union types for restricted string values
- Leverage utility types like `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`
- Create custom types for complex data structures

### Event Handling
- Use proper TypeScript event types
- Prefer specific event types over generic `Event`

```tsx
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  // handle click
};

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};
```

### Hooks with TypeScript
- Type useState with explicit generic when initial value is null/undefined
- Use proper typing for useRef
- Type custom hooks return values

```tsx
const [user, setUser] = useState<User | null>(null);
const inputRef = useRef<HTMLInputElement>(null);

// Custom hook with proper typing
const useApi = <T>(url: string): { data: T | null; loading: boolean; error: string | null } => {
  // implementation
};
```

### Props and Children
- Use `React.ReactNode` for children prop
- Use `React.ComponentProps<'element'>` to extend native element props
- Implement proper prop spreading with TypeScript

```tsx
interface InputProps extends React.ComponentProps<'input'> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...inputProps }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} />
      {error && <span className="error">{error}</span>}
    </div>
  );
};
```

### Context API with TypeScript
- Always provide default context value
- Create custom hooks for context consumption
- Type context providers properly

```tsx
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### Conditional Rendering
- Use type guards for runtime type checking
- Leverage TypeScript's strict null checks
- Handle optional properties safely

```tsx
const UserProfile: React.FC<{ user?: User }> = ({ user }) => {
  if (!user) {
    return <div>No user data</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      {user.email && <p>{user.email}</p>}
    </div>
  );
};
```

### Error Boundaries
- Implement typed error boundaries
- Use proper error types

```tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

### Performance Optimization
- Use `React.memo()` with proper comparison functions
- Type useCallback and useMemo properly
- Implement proper dependency arrays

```tsx
const MemoizedComponent = React.memo<ComponentProps>(({ data, onUpdate }) => {
  const handleClick = useCallback((id: string) => {
    onUpdate(id);
  }, [onUpdate]);

  const processedData = useMemo(() => {
    return data.filter(item => item.active);
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <button key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </button>
      ))}
    </div>
  );
});
```

### Testing TSX Components
- Use proper TypeScript types in tests
- Type test utilities and mocks
- Use jest-dom matchers with proper typing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders with correct variant class', () => {
    render(<Button variant="primary" onClick={mockOnClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
  });

  it('calls onClick when clicked', () => {
    render(<Button variant="secondary" onClick={mockOnClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
```

## TSX Best Practices

### File Organization
- Use `.tsx` extension for files containing JSX
- Keep component files focused and single-purpose
- Export default for main component, named exports for utilities

### Import/Export Patterns
```tsx
// Default export for main component
export default Button;

// Named exports for related utilities
export { ButtonVariant } from './Button.types';
export { useButtonState } from './Button.hooks';

// Type-only imports
import type { ButtonProps } from './Button.types';
```

### Strict TypeScript Configuration
- Enable strict mode in tsconfig.json
- Use `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`
- Configure path mapping for clean imports

### Documentation
- Use JSDoc comments for component documentation
- Document complex type definitions
- Provide usage examples in comments

```tsx
/**
 * A reusable button component with multiple variants
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleSubmit}>
 *   Submit Form
 * </Button>
 * ```
 */
interface ButtonProps {
  /** The visual style variant of the button */
  variant: 'primary' | 'secondary' | 'danger';
  /** Click handler function */
  onClick: () => void;
  /** Button content */
  children: React.ReactNode;
  /** Whether the button is disabled */
  disabled?: boolean;
}
```

## Common Pitfalls to Avoid

1. **Any Type Usage**: Avoid `any` type, use proper typing or `unknown`
2. **Missing Key Props**: Always provide unique keys for list items
3. **Prop Drilling**: Use Context API or state management for deeply nested props
4. **Untyped Event Handlers**: Always type event parameters
5. **Missing Error Boundaries**: Implement error boundaries for production apps
6. **Inefficient Re-renders**: Use React DevTools to identify performance issues

## Tools and Configuration

### Recommended VS Code Extensions
- TypeScript Importer
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer

### ESLint Rules for TSX
```json
{
  "@typescript-eslint/explicit-function-return-type": "warn",
  "react/prop-types": "off",
  "@typescript-eslint/no-unused-vars": "error",
  "react-hooks/exhaustive-deps": "warn"
}
```