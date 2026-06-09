# 🚀 AI-Powered SaaS Platform

A modern, production-ready SaaS application built with cutting-edge technologies. This platform features an AI-enhanced customer support system, real-time chat capabilities, and enterprise-grade authentication.

## 📋 Table of Contents

- [What is this project?](#what-is-this-project)
- [Project Structure Overview](#project-structure-overview)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [Database Schema](#database-schema)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [Learn More](#learn-more)

---

## 🎯 What is this project?

This is a **Software-as-a-Service (SaaS) platform** designed to help businesses manage customer conversations and support. Here's what it does:

- **For Businesses**: Manage customer conversations from one dashboard
- **For Customers**: Chat with AI-powered support agents
- **For Developers**: Built with modern, scalable technologies

### Think of it like:
- A customer service office where AI helps answer questions
- A dashboard where support agents can see all conversations
- A smart system that remembers visitor information

---

## 🏗️ Project Structure Overview

```
saas_application/
├── 📁 apps/                          # Applications
│   ├── 🌐 web/                       # Main web application (Next.js)
│   │   ├── app/                      # App router pages
│   │   │   ├── (auth)/               # Login/Signup pages
│   │   │   ├── (dashboard)/          # Main dashboard pages
│   │   │   │   ├── billing/          # Payment settings
│   │   │   │   ├── conversations/    # Chat management
│   │   │   │   ├── customization/    # Look & feel settings
│   │   │   │   ├── files/            # File management
│   │   │   │   ├── integrations/     # Connect other tools
│   │   │   │   └── plugin/           # Plugin settings
│   │   │   ├── api/                  # Backend API routes
│   │   │   ├── layout.tsx            # Main layout
│   │   │   └── page.tsx              # Home page
│   │   ├── components/               # React components
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── lib/                      # Utility functions
│   │   ├── modules/                  # Feature modules
│   │   │   ├── auth/                 # Authentication module
│   │   │   └── dashboard/            # Dashboard module
│   │   └── middleware.ts             # Route protection
│   │
│   └── 📦 widget/                    # Embeddable widget app
│
├── 📁 packages/                      # Shared packages
│   ├── 🎨 ui/                        # Reusable UI components library
│   │   └── src/components/           # 50+ components
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── form.tsx
│   │       ├── sidebar.tsx
│   │       └── ...and more!
│   │
│   ├── ⚙️ backend/                   # Backend services (Convex)
│   │   └── convex/
│   │       ├── public/               # Public API functions
│   │       ├── private/              # Private functions
│   │       ├── schema.ts             # Database design
│   │       └── auth.config.ts        # Auth configuration
│   │
│   ├── 🧮 math/                      # Math utilities
│   ├── 🔧 eslint-config/             # Code style rules
│   └── 📝 typescript-config/         # TypeScript settings
│
├── 📄 package.json                   # Project dependencies
├── 📄 turbo.json                     # Turborepo configuration
└── 📄 README.md                      # This file!
```

---

## 🛠️ Tech Stack

### Frontend Technologies

| Technology | Purpose | Why it's cool |
|------------|---------|---------------|
| **Next.js 15** | React Framework | Fast, SEO-friendly, modern features |
| **React 19** | UI Library | Latest version with better performance |
| **TypeScript 5.9** | Programming Language | Catches bugs before running |
| **Tailwind CSS** | Styling | Write CSS right in your code! |
| **shadcn/ui** | UI Components | Beautiful, customizable components |
| **Radix UI** | Accessibility | Works great with screen readers |

### Backend Technologies

| Technology | Purpose | Why it's cool |
|------------|---------|---------------|
| **Convex** | Database + Server | Real-time, auto-scaling, no setup needed |
| **Clerk** | Authentication | Secure login/signup without the headache |
| **@ai-sdk** | AI Integration | Connect to GPT, Google AI, Groq |
| **Sentry** | Error Tracking | Know when things break in production |

### Development Tools

| Technology | Purpose |
|------------|---------|
| **Turborepo** | Fast builds across multiple apps |
| **pnpm** | Package manager (fast & efficient) |
| **ESLint** | Code quality checks |
| **Prettier** | Code formatting |

---

## ✨ Key Features

### 1. 🔐 User Authentication
- **Sign Up / Sign In** with email or social providers
- **Organization support** for team accounts
- **Protected routes** - only logged-in users can access dashboard

### 2. 💬 AI-Powered Conversations
- Real-time chat with customers
- AI agents can respond automatically
- Conversation history tracking
- Status management (unresolved, escalated, resolved)

### 3. 👥 Contact Session Management
- Track website visitors automatically
- Store browser info (browser type, screen size, etc.)
- Session expiration management
- Geographic information (timezone, language)

### 4. 📊 Dashboard System
- Clean, responsive sidebar navigation
- Multiple dashboard pages (billing, files, integrations)
- Mobile-friendly design
- Dark mode support

### 5. 🎨 Beautiful UI Components
- 50+ pre-built components
- Consistent design system
- Easy to customize
- Accessible to everyone

### 6. 📁 Real-time Database
- Automatic data synchronization
- No manual API writing needed
- Type-safe queries
- Serverless backend

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **pnpm** - Install with: `npm install -g pnpm`
- **Convex account** - [Sign up here](https://convex.dev/)
- **Clerk account** - [Sign up here](https://clerk.com/)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd saas_application
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env.local` files:

   ```bash
   # In apps/web/.env.local
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   
   # In packages/backend/.env.local
   CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   ```

4. **Start the development servers**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend Dashboard: http://localhost:3210 (Convex)

### Setting up the Database

```bash
# Push schema to Convex
cd packages/backend
npx convex dev
```

---

## 🏛️ Project Architecture

### High-Level Diagram

```
┌──────���──────────────────────────────────────────────────┐
│                    User's Browser                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Frontend (apps/web)                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐    │
│  │   Clerk     │ │  Dashboard  │ │  Conversations  │    │
│  │  Auth UI    │ │    Pages    │ │    Component    │    │
│  └─────────────┘ └─────────────┘ └─────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          │
                    HTTPS API Calls
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Convex Backend (packages/backend)           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐    │
│  │   Public    │ │   Private   │ │     AI Agent    │    │
│  │  Functions  │ │  Functions  │ │    Functions    │    │
│  └─────────────┘ └─────────────┘ └─────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Convex Database                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐    │
│  │ conversations│ │contactSessions│ │    users       │    │
│  └─────────────┘ └─────────────┘ └─────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### How It Works

1. **User visits the website** → Clerk handles authentication
2. **Dashboard loads** → Next.js serves the page
3. **Data is needed** → Calls Convex functions
4. **AI responds** → Uses @ai-sdk to connect to AI models
5. **Data saves** → Convex database stores it automatically
6. **Real-time updates** → Changes appear instantly for all users

---

## 📊 Database Schema

The database has three main data collections:

### 1. 💬 Conversations
Stores chat conversations between customers and support.

```typescript
{
  threadId: string;              // Unique chat thread ID
  contactSessionId: string;      // Who was chatting
  organizationId: string;        // Which business owns this
  status: "unresolved" | "escalated" | "resolved"  // Current state
}
```

**Indexes**: By organization, by session, by status, by thread ID

### 2. 👤 Contact Sessions
Stores visitor information when they first arrive.

```typescript
{
  name: string;                  // Visitor's name
  email: string;                 // Visitor's email
  organizationId: string;        // Which business
  expireAt: number;             // When this session expires
  metadata: {
    userAgent: string;          // Browser info
    language: string;           // Preferred language
    platform: string;           // Windows/Mac/Linux
    screenResolution: string;   // Screen size
    timezone: string;           // Visitor's timezone
    // ... and more!
  }
}
```

**Indexes**: By organization, by expiration time

### 3. 👥 Users
Stores user account information.

```typescript
{
  name: string;                  // User's name
}
```

---

## 📜 Available Scripts

Run these from the root directory:

```bash
# Install all dependencies
pnpm install

# Start development servers (frontend + backend)
pnpm dev

# Build all apps and packages for production
pnpm build

# Check code for errors
pnpm lint

# Format code automatically
pnpm format

# Check for TypeScript errors
pnpm typecheck


---

## 🎨 UI Components Library

The `@workspace/ui` package includes 50+ components:

### Commonly Used Components

| Component | Description | Example |
|-----------|-------------|---------|
| `Button` | Clickable buttons | `<Button>Click me</Button>` |
| `Dialog` | Pop-up windows | Confirmation dialogs |
| `Form` | Input forms with validation | Login forms |
| `Sidebar` | Navigation sidebar | Dashboard navigation |
| `Card` | Content containers | Feature cards |
| `Table` | Data tables | Display lists |
| `Input` | Text fields | Search boxes |
| `Avatar` | User profile images | Profile pictures |

### Using Components

```tsx
import { Button, Card, Dialog } from "@workspace/ui/components/button";

export function MyComponent() {
  return (
    <Card>
      <Dialog>
        <Button>Open Dialog</Button>
      </Dialog>
    </Card>
  );
}
```

Adding new components:

```bash
cd apps/web
pnpm dlx shadcn@latest add button -c apps/web
```

---

## 🤝 Contributing

We welcome contributions! Here's how to help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to GitHub**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Coding Standards

- Use TypeScript for all new code
- Run `pnpm format` before committing
- Run `pnpm lint` to check for issues
- Write tests for new features
- Update documentation as needed

---

## 📚 Learn More

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### Convex
- [Convex Documentation](https://docs.convex.dev)
- [Database Guide](https://docs.convex.dev/database)
- [Functions Tutorial](https://docs.convex.dev/functions)

### Clerk Authentication
- [Clerk Documentation](https://clerk.com/docs)
- [Authentication Guide](https://clerk.com/docs/authentication)

### shadcn/ui
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Turborepo
- [Turborepo Documentation](https://turbo.build/repo/docs)

---

## 📈 Project Stats

- **Languages**: TypeScript (100%)
- **Framework**: Next.js 15 + React 19
- **Packages**: 5 shared packages
- **Apps**: 2 applications
- **UI Components**: 50+
- **Monorepo Tool**: Turborepo

---


## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Convex](https://convex.dev/) - Backend Platform
- [Clerk](https://clerk.com/) - Authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Accessibility
- [Turborepo](https://turbo.build/repo) - Build System
- [pnpm](https://pnpm.io/) - Package Manager

---


## 🚀 Quick Start Checklist

- [ ] Clone the repository
- [ ] Install pnpm: `npm install -g pnpm`
- [ ] Run `pnpm install`
- [ ] Set up Clerk account and get API keys
- [ ] Set up Convex account and get URL
- [ ] Create `.env.local` files
- [ ] Run `pnpm dev`
- [ ] Open http://localhost:3000

