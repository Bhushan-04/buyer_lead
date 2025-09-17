# Buyers Lead Intake

A secure **Next.js 14 + Prisma + Supabase** application for managing real estate leads (buyers).  
Supports **CRUD operations**, user authentication (demo), and buyer history tracking.

---

## Features

- **Authentication**: Simple demo login with cookie-based sessions.
- **User Ownership**: Each buyer is owned by the user who created it.
- **Leads Management**:
  - Create, read, update, and delete buyers.
  - Only the owner can edit or delete a buyer.
- **Buyer History**: Logs what changed, who changed it, and when.
- **Search & Filter**: Search buyers by multiple fields with debounced queries for optimized UX.
- **UI/UX**: Responsive design built with TailwindCSS.

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Validation**: Zod

---

## Setup & Running Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Bhushan-04/buyer_lead.git
cd buyer_lead

```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME"
DIRECT_URL = ""
```

### 4. Set Up the Database with Prisma

```bash
npx prisma init
npx prisma generate
npx prisma migrate --name init
```
### 5. Run the Development Server
npm run dev

## Validation
Validation using zod

## Server vs Client Rendering
Client Components: Handle forms, search, and interactions.
Server Components: Handle initial page load and data fetching (SSR).

## Ownership Enforcement
-Buyer records have an ownerId.
-API routes check that the current user matches ownerId before allowing PUT or DELETE operations.
-Prevents unauthorized edits or deletes.