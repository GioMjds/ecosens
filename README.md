# NestJS + Next.js Full-Stack Template

A production-ready, scalable full-stack TypeScript template combining **NestJS** (backend) and **Next.js 15** (frontend) with modern development practices and tools.

## 🚀 Tech Stack

### Backend (NestJS)
- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **Database ORM**: Prisma 6
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier

### Frontend (Next.js)
- **Framework**: Next.js 15 with App Router & Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Animations**: Framer Motion
- **UI Components**: Custom components with Tailwind

## 📁 Project Structure

```folder
├── backend/           # NestJS backend application
└── frontend/          # Next.js frontend application
```

---

## 🗂️ Backend Architecture (`backend/`)

The backend follows a **modular, layered architecture** pattern for maintainability and scalability.

### NestJS Directory Structure & Purpose

```folder
backend/
├── prisma/
│   └── schema.prisma              # Database schema definitions
├── src/
│   ├── main.ts                    # Application entry point
│   ├── controllers/               # HTTP request handlers
│   │   ├── app.controller.ts      # Root/health check endpoints
│   │   └── message.controller.ts  # Example feature controller
│   ├── services/                  # Business logic layer
│   │   └── app.service.ts         # Core application services
│   ├── modules/                   # NestJS modules (feature grouping)
│   │   └── app.module.ts          # Root application module
│   ├── repositories/              # Data access layer (Prisma queries)
│   ├── exceptions/                # Custom exception classes
│   ├── mappers/                   # Data transformation utilities (DTO ↔ Entity)
│   └── validators/                # Custom validation pipes & decorators
└── test/                          # E2E and integration tests
    ├── app.e2e-spec.ts
    └── jest-e2e.json
```

### Layer Responsibilities

#### **Controllers** (`src/controllers/`)

- Handle HTTP requests and responses
- Validate request data using DTOs
- Delegate business logic to services
- Define API routes and HTTP methods
- **Example**: `message.controller.ts` - Handles message-related endpoints

**Best Practices:**

- Keep controllers thin - no business logic
- Use decorators for routing, guards, and interceptors
- Return standardized response formats

#### **Services** (`src/services/`)

- Implement core business logic
- Orchestrate operations between repositories
- Handle data transformation and validation
- Manage transactions and error handling
- **Example**: `app.service.ts` - Application-level services

**Best Practices:**

- Single Responsibility Principle
- Inject repositories via constructor
- Use service-to-service communication when needed
- Keep methods focused and testable

#### **Repositories** (`src/repositories/`)

- Abstract Prisma database operations
- Encapsulate query logic
- Provide type-safe database access
- Handle database-specific errors

**Purpose:**

```typescript
// Example: UserRepository
export class UserRepository {
  constructor(private prisma: PrismaService) {}
  
  async findById(id: string) { /* ... */ }
  async create(data: CreateUserDto) { /* ... */ }
  async update(id: string, data: UpdateUserDto) { /* ... */ }
}
```

**Best Practices:**

- One repository per entity/model
- Return domain entities, not Prisma objects
- Use transactions for multi-step operations

#### **Modules** (`src/modules/`)

- Group related features (controllers, services, repositories)
- Define dependency injection containers
- Configure module imports/exports
- **Example**: `app.module.ts` - Root module configuration

**Best Practices:**

- Feature-based module organization
- Lazy load modules when possible
- Keep modules cohesive and loosely coupled

#### **Exceptions** (`src/exceptions/`)

- Custom exception classes extending NestJS HttpException
- Domain-specific error handling
- Standardized error responses

**Purpose:**

```typescript
// Example: Custom exceptions
export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`);
  }
}
```

#### **Mappers** (`src/mappers/`)

- Transform between DTOs and domain entities
- Convert database models to API responses
- Handle data serialization/deserialization

**Purpose:**

```typescript
// Example: UserMapper
export class UserMapper {
  static toDto(entity: User): UserDto { /* ... */ }
  static toEntity(dto: CreateUserDto): User { /* ... */ }
}
```

#### **Validators** (`src/validators/`)

- Custom validation pipes
- Reusable validation decorators
- Complex validation logic

**Purpose:**

```typescript
// Example: Custom validators
@IsUnique('email')  // Custom decorator
export class CreateUserDto { /* ... */ }
```

### Database (Prisma)

- **Schema**: Define models in `prisma/schema.prisma`
- **Migrations**: Run `npx prisma migrate dev` for development
- **Client**: Auto-generated type-safe database client

---

## 🎨 Frontend Architecture (`frontend/`)

The frontend uses **Next.js App Router** with a feature-based structure and separation of concerns.

### Next.js Directory Structure & Purpose

```folder
frontend/
├── app/                           # Next.js App Router pages
│   ├── (protected)/              # Protected routes (require auth)
│   │   ├── layout.tsx            # Protected layout wrapper
│   │   ├── login/                # Login page
│   │   └── register/             # Registration page
│   ├── (public)/                 # Public routes
│   │   ├── layout.tsx            # Public layout wrapper
│   │   └── page.tsx              # Home page
│   ├── globals.css               # Global styles & Tailwind imports
│   ├── manifest.ts               # PWA manifest configuration
│   └── global-not-found.tsx      # 404 error page
├── components/                    # Reusable UI components
│   └── Button.tsx                # Example: Custom button component
├── layouts/                       # Layout components
│   ├── Header.tsx                # Site header
│   ├── Footer.tsx                # Site footer
│   └── Navbar.tsx                # Navigation bar
├── lib/                          # Core utilities & configurations
│   ├── axios.ts                  # Axios instance with interceptors
│   └── TanstackQuery.tsx         # React Query provider setup
├── queries/                      # TanStack Query hooks
│   └── [feature].queries.ts      # Feature-specific API queries
├── hooks/                        # Custom React hooks
│   └── [custom-hook].ts          # Reusable logic hooks
├── stores/                       # Client-side state management
│   └── [feature].store.ts        # Feature-specific stores (Zustand/Context)
├── types/                        # TypeScript type definitions
│   └── [feature].types.ts        # Shared types and interfaces
├── utils/                        # Utility functions
│   └── [utility].ts              # Helper functions
├── constants/                    # Application constants
│   └── [feature].constants.ts    # Configuration & static values
├── public/                       # Static assets (images, fonts, etc.)
└── middleware.ts                 # Next.js middleware (auth, redirects)
```

### Layer Responsibilities

#### **App Directory** (`app/`)

- Next.js 15 App Router pages and routing
- **Route Groups**:
  - `(protected)/` - Routes requiring authentication
  - `(public)/` - Publicly accessible routes
- Each folder with `page.tsx` becomes a route
- `layout.tsx` provides shared UI for route segments

**Best Practices:**

- Use Server Components by default
- Add `'use client'` only when needed (interactivity, hooks)
- Leverage parallel and intercepting routes for advanced UX

#### **Components** (`components/`)

- Reusable, presentational UI components
- Atomic design principles (atoms, molecules, organisms)
- No business logic - receive data via props

**Purpose:**

```typescript
// Example: Reusable components
export function Button({ variant, children, ...props }) {
  return <button className={...} {...props}>{children}</button>
}
```

**Best Practices:**

- Keep components small and focused
- Use TypeScript for prop types
- Make components composable

#### **Layouts** (`layouts/`)

- Shared layout components (Header, Footer, Navbar)
- Application-wide UI structure
- Navigation and branding elements

**Purpose:**

- Consistent UI across pages
- Responsive design patterns
- Accessibility features

#### **Lib** (`lib/`)

- Core library configurations
- Third-party integrations
- Provider wrappers

**Key Files:**

- `axios.ts` - HTTP client with interceptors, base URL, auth headers
- `TanstackQuery.tsx` - React Query provider with default options

#### **Queries** (`queries/`)

- TanStack Query (React Query) hooks
- API data fetching, caching, and synchronization
- Mutations for POST/PUT/DELETE operations

**Purpose:**

```typescript
// Example: User queries
export const useUsers = () => useQuery({
  queryKey: ['users'],
  queryFn: () => api.get('/users')
})

export const useCreateUser = () => useMutation({
  mutationFn: (data) => api.post('/users', data)
})
```

**Best Practices:**

- Organize by feature/domain
- Use consistent query key patterns
- Implement optimistic updates for mutations

#### **Hooks** (`hooks/`)

- Custom React hooks for reusable logic
- State management patterns
- Side effect handling

**Purpose:**

```typescript
// Example: Custom hooks
export const useAuth = () => { /* ... */ }
export const useDebounce = (value, delay) => { /* ... */ }
```

#### **Stores** (`stores/`)

- Client-side global state (Zustand, Context API, or similar)
- Shared state across components
- Persistent state management

**Purpose:**

```typescript
// Example: Auth store
export const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null })
}))
```

#### **Types** (`types/`)

- Shared TypeScript interfaces and types
- API response/request types
- Domain models

**Purpose:**

```typescript
// Example: User types
export interface User {
  id: string;
  email: string;
  name: string;
}

export type CreateUserDto = Omit<User, 'id'>;
```

#### **Utils** (`utils/`)

- Pure utility functions
- Data transformation helpers
- Validation utilities

**Purpose:**

```typescript
// Example: Utilities
export const formatDate = (date: Date) => { /* ... */ }
export const capitalize = (str: string) => { /* ... */ }
```

#### **Constants** (`constants/`)

- Application-wide constants
- Configuration values
- API endpoints, error messages, etc.

**Purpose:**

```typescript
// Example: Constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard'
};
```

#### **Public** (`public/`)

- Static assets (images, fonts, icons)
- Directly accessible via URL
- Files served as-is by Next.js

#### **Middleware** (`middleware.ts`)

- Edge middleware for request/response manipulation
- Authentication checks before rendering
- Redirects and rewrites

**Purpose:**

```typescript
// Example: Auth middleware
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  if (!token) return NextResponse.redirect('/login');
}
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm (preferred package manager)
- PostgreSQL database (or update Prisma provider)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd next-and-nest-js-template
   ```

2. **Install dependencies**

   ```bash
   # Backend
   cd backend
   pnpm install
   
   # Frontend
   cd ../frontend
   pnpm install
   ```

3. **Environment Setup**

   **Backend** (`backend/.env`):

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
   PORT=3001
   ```

   **Frontend** (`frontend/.env`):

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Database Setup**

   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run Development Servers**

   **Backend** (in `backend/` directory):

   ```bash
   pnpm run start:dev
   ```
   Backend runs on: `http://localhost:3001`

   **Frontend** (in `frontend/` directory):
   ```bash
   pnpm run dev
   ```
   Frontend runs on: `http://localhost:3000`

---

## 📝 Development Workflow

### Backend Development

1. **Create a new feature module**
   ```bash
   cd backend
   nest generate module features/users
   nest generate service features/users
   nest generate controller features/users
   ```

2. **Add Prisma model** (`prisma/schema.prisma`)
   ```prisma
   model User {
     id        String   @id @default(uuid())
     email     String   @unique
     name      String
     createdAt DateTime @default(now())
   }
   ```

3. **Generate Prisma client**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name add-user-model
   ```

4. **Create repository** (`src/repositories/user.repository.ts`)
5. **Implement service logic** (`src/services/users.service.ts`)
6. **Add controller endpoints** (`src/controllers/users.controller.ts`)
7. **Write tests** (`test/users.e2e-spec.ts`)

### Frontend Development

1. **Create a new page** (`app/users/page.tsx`)
2. **Add API query** (`queries/users.queries.ts`)
3. **Create components** (`components/UserList.tsx`)
4. **Add types** (`types/user.types.ts`)
5. **Style with Tailwind CSS**

---

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

### Frontend Tests
*Add your preferred testing framework (Jest, Vitest, Playwright, etc.)*

---

## 🏗️ Build & Deployment

### Backend Build
```bash
cd backend
pnpm run build
pnpm run start:prod
```

### Frontend Build
```bash
cd frontend
pnpm run build
pnpm run start
```

---

## 📚 Best Practices

### General
- ✅ Use TypeScript strictly - enable `strict: true`
- ✅ Follow consistent naming conventions
- ✅ Write unit and integration tests
- ✅ Use environment variables for configuration
- ✅ Document complex logic with comments
- ✅ Keep dependencies up to date

### Backend (NestJS)
- ✅ Use DTOs for validation and type safety
- ✅ Implement proper error handling with custom exceptions
- ✅ Use dependency injection for testability
- ✅ Keep controllers thin, services focused
- ✅ Use Prisma migrations for schema changes
- ✅ Implement proper logging (consider Winston/Pino)

### Frontend (Next.js)
- ✅ Use Server Components by default
- ✅ Optimize images with `next/image`
- ✅ Implement proper loading and error states
- ✅ Use TanStack Query for server state
- ✅ Keep client-side state minimal
- ✅ Implement proper SEO with metadata

---

## 🔐 Security Considerations

- Use environment variables for secrets
- Implement authentication & authorization (JWT, sessions)
- Validate all user inputs
- Use HTTPS in production
- Enable CORS properly
- Implement rate limiting
- Keep dependencies updated (security patches)

---

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 📄 License

This template is [UNLICENSED] - customize as needed for your project.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Happy Coding! 🚀**
