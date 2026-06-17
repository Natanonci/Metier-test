# Metier Blog System

A high-performance Blog System with a robust Admin Panel, built as part of a recruitment assignment.

## 🚀 Tech Stack

- **Framework:** [Next.js 14+ (App Router)](https://nextjs.org/) - For SSR, ISR, and seamless Server Actions.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) - For a modern, responsive, and accessible UI.
- **Database ORM:** [Prisma](https://www.prisma.io/) - For type-safe database queries.
- **Validation:** [Zod](https://zod.dev/) - Ensuring strict data integrity across the stack.
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) - Lightweight and scalable client-side state.
- **Icons:** [Lucide React](https://lucide.dev/) - For clean, consistent iconography.

## 🏗️ Architecture

The project follows a **Clean Architecture** approach:
- **Presentation Layer:** Next.js Server Components for SEO and performance, Client Components for interactivity.
- **Business Logic:** Encapsulated in Server Actions and custom hooks.
- **Data Access:** Abstracted via Prisma, ensuring the UI remains decoupled from database specifics.
- **Validation:** Centralized Zod schemas used for both frontend forms and backend API/Action validation.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- A PostgreSQL database (or compatible)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd metiertestblog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory (refer to `.env.example` if available):
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   JWT_SECRET="your-secret-key"
   ```

4. **Database Migration:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## ✨ Features

### Public Blog
- [x] **Blog List:** Paginated (10/page), searchable by title.
- [x] **Blog Detail:** Rich content, image gallery (up to 7 images), and view count tracking.
- [x] **Comment System:** Strict Thai-character validation and moderation workflow.

### Admin Panel
- [x] **Secure Login:** Protected dashboard for authorized users.
- [x] **Blog Management:** Full CRUD capabilities with slug customization.
- [x] **Comment Moderation:** Approve or Reject comments to manage site quality.
- [x] **Publishing Control:** Toggle visibility of blogs with a single click.

## 📝 Comment Validation Logic

The system employs a strict Regex pattern for comment validation:
`^[ก-๙0-9\s]+$`
- `ก-๙`: Matches all Thai characters.
- `0-9`: Matches numbers.
- `\s`: Matches whitespaces (spaces, newlines).
This ensures compliance with the recruitment assignment's requirements.
