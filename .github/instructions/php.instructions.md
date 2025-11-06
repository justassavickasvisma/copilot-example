---
applyTo: "**/*.php"
---

# PHP Development Instructions

## Overview
This file contains specific guidelines for PHP development within this project.

## PHP-Specific Guidelines

### Code Style and Formatting
- Follow PSR-1 and PSR-12 coding standards
- Use 4 spaces for indentation (no tabs)
- Use Unix line endings (LF)
- Files must end with a single blank line
- Opening PHP tag `<?php` must be on its own line

```php
<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\User;
use App\Services\AuthService;

class UserController
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function index(): array
    {
        return User::all();
    }
}
```

### Type Declarations
- Always use strict types: `declare(strict_types=1)`
- Use type hints for all parameters and return types (PHP 7.4+)
- Use nullable types when appropriate (`?string`, `?int`)
- Use union types for PHP 8.0+ (`string|int`)

```php
<?php

declare(strict_types=1);

public function processUser(?User $user): string|null
{
    if ($user === null) {
        return null;
    }
    
    return $user->getName();
}

// Use typed properties (PHP 7.4+)
class User
{
    private string $name;
    private int $age;
    private ?string $email = null;
    
    public function __construct(string $name, int $age, ?string $email = null)
    {
        $this->name = $name;
        $this->age = $age;
        $this->email = $email;
    }
}
```

### Class Structure
- Follow single responsibility principle
- Use proper access modifiers (`private`, `protected`, `public`)
- Implement interfaces and use dependency injection
- Use abstract classes and traits when appropriate

```php
<?php

declare(strict_types=1);

namespace App\Services;

interface UserServiceInterface
{
    public function createUser(array $userData): User;
    public function findUser(int $id): ?User;
}

class UserService implements UserServiceInterface
{
    private UserRepository $repository;
    private ValidatorService $validator;

    public function __construct(
        UserRepository $repository,
        ValidatorService $validator
    ) {
        $this->repository = $repository;
        $this->validator = $validator;
    }

    public function createUser(array $userData): User
    {
        $this->validator->validate($userData, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'age' => 'required|integer|min:18'
        ]);

        return $this->repository->create($userData);
    }

    public function findUser(int $id): ?User
    {
        return $this->repository->find($id);
    }
}
```

### Error Handling
- Use exceptions for error handling
- Create custom exception classes
- Implement proper try-catch blocks
- Log errors appropriately

```php
<?php

declare(strict_types=1);

namespace App\Exceptions;

class UserNotFoundException extends \Exception
{
    public function __construct(int $userId)
    {
        parent::__construct("User with ID {$userId} not found");
    }
}

class UserService
{
    public function getUser(int $id): User
    {
        try {
            $user = $this->repository->find($id);
            
            if ($user === null) {
                throw new UserNotFoundException($id);
            }
            
            return $user;
        } catch (DatabaseException $e) {
            \Log::error('Database error while fetching user', [
                'user_id' => $id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
```

### Database Interactions
- Use prepared statements to prevent SQL injection
- Implement proper ORM usage (Eloquent, Doctrine, etc.)
- Use transactions for data consistency
- Implement proper database connection management

```php
<?php

declare(strict_types=1);

// Using PDO with prepared statements
class UserRepository
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function findByEmail(string $email): ?User
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE email = :email');
        $stmt->bindParam(':email', $email, \PDO::PARAM_STR);
        $stmt->execute();
        
        $userData = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        return $userData ? User::fromArray($userData) : null;
    }

    public function createUser(User $user): bool
    {
        $this->pdo->beginTransaction();
        
        try {
            $stmt = $this->pdo->prepare(
                'INSERT INTO users (name, email, age) VALUES (:name, :email, :age)'
            );
            
            $stmt->execute([
                ':name' => $user->getName(),
                ':email' => $user->getEmail(),
                ':age' => $user->getAge()
            ]);
            
            $this->pdo->commit();
            return true;
        } catch (\Exception $e) {
            $this->pdo->rollback();
            throw $e;
        }
    }
}
```

### Security Best Practices
- Validate and sanitize all input data
- Use CSRF protection for forms
- Implement proper authentication and authorization
- Use password hashing (password_hash/password_verify)
- Escape output data appropriately

```php
<?php

declare(strict_types=1);

class AuthController
{
    public function login(ServerRequest $request): Response
    {
        // Validate CSRF token
        if (!$this->csrfValidator->validate($request)) {
            throw new SecurityException('Invalid CSRF token');
        }

        // Sanitize and validate input
        $email = filter_var(
            $request->getParsedBody()['email'] ?? '',
            FILTER_VALIDATE_EMAIL
        );
        
        if (!$email) {
            return $this->errorResponse('Invalid email address');
        }

        $password = $request->getParsedBody()['password'] ?? '';
        
        if (strlen($password) < 8) {
            return $this->errorResponse('Password too short');
        }

        // Authenticate user
        $user = $this->userService->findByEmail($email);
        
        if (!$user || !password_verify($password, $user->getPasswordHash())) {
            return $this->errorResponse('Invalid credentials');
        }

        // Create session
        $this->sessionManager->createSession($user);
        
        return $this->successResponse(['message' => 'Login successful']);
    }

    public function register(array $userData): User
    {
        // Hash password before storing
        $userData['password'] = password_hash(
            $userData['password'],
            PASSWORD_ARGON2ID
        );

        return $this->userService->createUser($userData);
    }
}
```

### Configuration Management
- Use environment variables for sensitive configuration
- Implement configuration classes
- Use proper configuration validation

```php
<?php

declare(strict_types=1);

class DatabaseConfig
{
    private string $host;
    private int $port;
    private string $database;
    private string $username;
    private string $password;

    public function __construct()
    {
        $this->host = $_ENV['DB_HOST'] ?? 'localhost';
        $this->port = (int) ($_ENV['DB_PORT'] ?? 3306);
        $this->database = $_ENV['DB_DATABASE'] ?? throw new \RuntimeException('DB_DATABASE not set');
        $this->username = $_ENV['DB_USERNAME'] ?? throw new \RuntimeException('DB_USERNAME not set');
        $this->password = $_ENV['DB_PASSWORD'] ?? throw new \RuntimeException('DB_PASSWORD not set');
    }

    public function getDsn(): string
    {
        return "mysql:host={$this->host};port={$this->port};dbname={$this->database}";
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function getPassword(): string
    {
        return $this->password;
    }
}
```

### Testing
- Write unit tests using PHPUnit
- Use test doubles (mocks, stubs) appropriately
- Implement integration tests for complex workflows
- Use data providers for testing multiple scenarios

```php
<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;
use App\Services\UserService;
use App\Repositories\UserRepository;
use App\Services\ValidatorService;
use App\Models\User;

class UserServiceTest extends TestCase
{
    private UserService $userService;
    private MockObject $repository;
    private MockObject $validator;

    protected function setUp(): void
    {
        $this->repository = $this->createMock(UserRepository::class);
        $this->validator = $this->createMock(ValidatorService::class);
        
        $this->userService = new UserService(
            $this->repository,
            $this->validator
        );
    }

    public function testCreateUserSuccessfully(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'age' => 25
        ];

        $expectedUser = new User('John Doe', 'john@example.com', 25);

        $this->validator
            ->expects($this->once())
            ->method('validate')
            ->with($userData, $this->isType('array'));

        $this->repository
            ->expects($this->once())
            ->method('create')
            ->with($userData)
            ->willReturn($expectedUser);

        $result = $this->userService->createUser($userData);

        $this->assertEquals($expectedUser, $result);
    }

    /**
     * @dataProvider invalidUserDataProvider
     */
    public function testCreateUserWithInvalidData(array $userData, string $expectedError): void
    {
        $this->validator
            ->expects($this->once())
            ->method('validate')
            ->willThrowException(new ValidationException($expectedError));

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage($expectedError);

        $this->userService->createUser($userData);
    }

    public function invalidUserDataProvider(): array
    {
        return [
            'missing name' => [
                ['email' => 'john@example.com', 'age' => 25],
                'Name is required'
            ],
            'invalid email' => [
                ['name' => 'John', 'email' => 'invalid-email', 'age' => 25],
                'Invalid email format'
            ],
            'underage user' => [
                ['name' => 'John', 'email' => 'john@example.com', 'age' => 17],
                'User must be at least 18 years old'
            ]
        ];
    }
}
```

### Performance Optimization
- Use opcode caching (OPcache)
- Implement proper caching strategies
- Optimize database queries
- Use lazy loading when appropriate

```php
<?php

declare(strict_types=1);

class CachedUserService
{
    private UserRepository $repository;
    private CacheInterface $cache;

    public function __construct(UserRepository $repository, CacheInterface $cache)
    {
        $this->repository = $repository;
        $this->cache = $cache;
    }

    public function getUser(int $id): ?User
    {
        $cacheKey = "user:{$id}";
        
        // Try to get from cache first
        $cachedUser = $this->cache->get($cacheKey);
        
        if ($cachedUser !== null) {
            return $cachedUser;
        }

        // Fetch from database if not in cache
        $user = $this->repository->find($id);
        
        if ($user !== null) {
            // Cache for 1 hour
            $this->cache->set($cacheKey, $user, 3600);
        }

        return $user;
    }

    public function updateUser(int $id, array $data): User
    {
        $user = $this->repository->update($id, $data);
        
        // Invalidate cache after update
        $this->cache->delete("user:{$id}");
        
        return $user;
    }
}
```

## PHP Best Practices

### File Organization
- Use PSR-4 autoloading standards
- Organize code by feature/domain, not by type
- Keep classes focused and follow SOLID principles

### Dependency Management
- Use Composer for dependency management
- Pin dependency versions in composer.lock
- Regularly update dependencies for security

### Documentation
- Use PHPDoc comments for all public methods
- Document complex algorithms and business logic
- Keep documentation up to date with code changes

```php
<?php

declare(strict_types=1);

/**
 * Service for managing user operations
 * 
 * This service handles user creation, updates, and retrieval
 * while maintaining data consistency and validation rules.
 */
class UserService
{
    /**
     * Creates a new user with the provided data
     * 
     * @param array<string, mixed> $userData The user data to create
     * @return User The created user instance
     * @throws ValidationException When user data is invalid
     * @throws DatabaseException When database operation fails
     */
    public function createUser(array $userData): User
    {
        // Implementation
    }

    /**
     * Finds a user by their unique identifier
     * 
     * @param int $id The user's unique identifier
     * @return User|null The user if found, null otherwise
     */
    public function findUser(int $id): ?User
    {
        // Implementation
    }
}
```

### Environment Setup
- Use .env files for environment-specific configuration
- Never commit sensitive data to version control
- Use proper error reporting levels for different environments

```php
<?php

// config/app.php
return [
    'debug' => (bool) ($_ENV['APP_DEBUG'] ?? false),
    'environment' => $_ENV['APP_ENV'] ?? 'production',
    'key' => $_ENV['APP_KEY'] ?? throw new RuntimeException('APP_KEY not set'),
    
    'database' => [
        'host' => $_ENV['DB_HOST'] ?? 'localhost',
        'port' => (int) ($_ENV['DB_PORT'] ?? 3306),
        'database' => $_ENV['DB_DATABASE'] ?? '',
        'username' => $_ENV['DB_USERNAME'] ?? '',
        'password' => $_ENV['DB_PASSWORD'] ?? '',
    ],
    
    'cache' => [
        'driver' => $_ENV['CACHE_DRIVER'] ?? 'file',
        'redis' => [
            'host' => $_ENV['REDIS_HOST'] ?? '127.0.0.1',
            'port' => (int) ($_ENV['REDIS_PORT'] ?? 6379),
        ],
    ],
];
```

## Common Pitfalls to Avoid

1. **SQL Injection**: Always use prepared statements
2. **XSS Attacks**: Escape output data appropriately
3. **Memory Leaks**: Unset large variables and close resources
4. **Global Variables**: Avoid global state, use dependency injection
5. **Magic Methods**: Use sparingly and document thoroughly
6. **Silent Errors**: Always handle exceptions and log errors
7. **Weak Typing**: Use strict types and proper type hints

## Tools and Configuration

### Recommended Tools
- **Composer**: Dependency management
- **PHPStan/Psalm**: Static analysis
- **PHP-CS-Fixer**: Code style fixing
- **PHPUnit**: Testing framework
- **Xdebug**: Debugging and profiling

### PHP Configuration (php.ini)
```ini
; Development settings
display_errors = On
error_reporting = E_ALL
log_errors = On
error_log = /var/log/php_errors.log

; Production settings (opposite of above)
display_errors = Off
error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT
log_errors = On

; Security settings
expose_php = Off
allow_url_fopen = Off
allow_url_include = Off

; Performance settings
opcache.enable = 1
opcache.memory_consumption = 128
opcache.max_accelerated_files = 4000
opcache.revalidate_freq = 60
```

### Composer Configuration
```json
{
    "require": {
        "php": "^8.1",
        "monolog/monolog": "^3.0",
        "vlucas/phpdotenv": "^5.4"
    },
    "require-dev": {
        "phpunit/phpunit": "^10.0",
        "phpstan/phpstan": "^1.9",
        "friendsofphp/php-cs-fixer": "^3.13"
    },
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Tests\\": "tests/"
        }
    }
}
```