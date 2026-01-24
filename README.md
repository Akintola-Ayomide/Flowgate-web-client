# Qline - Smart Queue Management (Web Frontend)

**Qline** is a modern, premium web application designed to streamline operations and enhance customer experiences through intelligent queue management. This repository contains the **web frontend**, built with the latest web technologies to deliver a sophisticated, responsive, and performance-driven user interface.

## 🚀 Key Features

### 🔐 Authentication & Security
- **Secure Cookie-Based Auth**: Fully implemented HTTP-only cookie authentication for maximum security (XSS protection).
- **Google OAuth Integration**: Native-feel "Continue with Google" flow with a dedicated loading state and callback handling (`/auth/callback`).
- **Robust State Management**: Global `AuthProvider` context managing user sessions, loading states, and automatic profile fetching.
- **Advanced Error Handling**: Custom `ApiError` class handling structured backend errors, providing clear feedback to users (e.g., validation issues, invalid credentials).

### 🎨 Design & Experience
- **Premium Aesthetics**: Glassmorphism effects (`backdrop-blur`, `bg-white/60`), vibrant gradients, and sophisticated typography (Geist Sans/Mono + Italic Accents).
- **Interactive Animations**: Smooth transitions powered by `framer-motion` for switching between Login and Signup modes (`AnimatePresence`).
- **Responsive Layout**: A split-screen design featuring a dynamic branding hero section (desktop) and a clean, focused form area (mobile/desktop).
- **Custom Branding**: Unique "Qline" logo design with a distinct typographic treatment and decorative background elements.

### 🏠 Landing Page
- **Comprehensive Sections**: Detailed 'Hero', 'Features', 'How It Works', 'App Download', and 'Footer' components.
- **Micro-Interactions**: Rich hover states, scroll-triggered animations, and spring physics using Framer Motion.
- **Navigation**: Smooth scroll functionality to defined sections (`#features`, `#how-it-works`, `#download`) and direct links to Auth.
- **Visuals**: Custom SVG iconography and CSS-drawn device mockups for a lightweight yet polished look.

### 🏗 Architecture
- **Feature-Based Structure**: Codebase organized by features (e.g., `features/auth`, `features/landing`) containing dedicated components, services, hooks, and types.
- **Shared UI Library**: Reusable implementation of atomic components (Buttons, Inputs, Checkboxes) located in `shared/ui`.
- **Next.js 16 App Router**: Leveraging Server Components and Client Components appropriately for performance and SEO.
- **TypeScript**: Strict type safety across DTOs, API responses, and Component props.

## 🛠 Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Font**: Geist & Geist Mono

## 📂 Project Structure

```
web-frontend/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── auth/             # Auth pages (e.g., Callback)
│   └── page.tsx          # Home page (Landing Page)
├── features/             # Feature-based modules
│   ├── auth/             # Authentication logic & UI
│   │   ├── components/
│   │   ├── context/
│   │   └── services/
│   └── landing/          # Landing Page sections
│       └── components/   # Hero, Features, Footer, etc.
├── shared/               # Shared resources
│   └── ui/               # Reusable atomic buttons, inputs, etc.
└── public/               # Static assets
```

## ⚙️ Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/Qline-web-frontend.git
    cd web-frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory:
    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Access the App**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔗 Backend Connect
This frontend is designed to consume a standard REST API with secure cookie support.
- **Base URL**: Configurable via `.env`
- **Auth Flow**: Uses `credentials: 'include'` for all requests to ensure HttpOnly cookies are passed.
- **Auth Endpoints**:
    - `POST /auth/login` (Returns 200 + Set-Cookie)
    - `POST /auth/register` (Returns 200 + Set-Cookie)
    - `POST /auth/logout` (Clears Cookies)
    - `GET /auth/profile`
    - `GET /auth/google` (Redirects to Provider)