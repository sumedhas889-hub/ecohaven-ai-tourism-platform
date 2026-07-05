# EcoHaven 🌿

## Overview

EcoHaven is a full-stack web application designed to help travelers discover sustainable homestays and eco-tourism experiences. The platform connects travelers with eco-friendly accommodations while promoting responsible tourism and supporting local communities. The application now includes a backend API with database integration for managing homestay listings.

---

## Features

### Frontend
- Responsive design
- Modern UI using Tailwind CSS
- AI-inspired homestay recommendations
- Smart search and filtering
- Eco-tourism activity discovery
- User-friendly interface

### Backend
- RESTful API using Express.js
- Full CRUD operations (Create, Read, Update, Delete)
- Search homestays by name or location
- PostgreSQL database integration using Prisma ORM
- Persistent cloud database storage

---

## Technology Stack

### Frontend
- Next.js
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- Supabase (PostgreSQL)

### ORM
- Prisma ORM

### AI Integration (Planned)
- OpenAI API / Gemini API

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/homestays` | Retrieve all homestays |
| GET | `/api/homestays/:id` | Retrieve a specific homestay |
| POST | `/api/homestays` | Create a new homestay |
| PUT | `/api/homestays/:id` | Update an existing homestay |
| DELETE | `/api/homestays/:id` | Delete a homestay |
| GET | `/api/search?q=value` | Search homestays |

---

## Database Choice

Supabase (PostgreSQL) was selected because it provides a reliable cloud-hosted relational database with excellent support for structured data. Prisma ORM simplifies database management and enables efficient CRUD operations.

---

## Database Schema

The Homestay table contains the following fields:

| Field | Type |
|-------|------|
| id | String (Primary Key) |
| name | String |
| location | String |
| price | Integer |

> Add your exported schema diagram image here.

```markdown
![Database Schema](W5_SchemaDiagram_<InternID>.png)
```

Replace `<InternID>` with your actual file name.

---

## Project Structure

```text
EcoHaven/
├── backend/
│   ├── prisma/
│   ├── prismaClient.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone <repository-url>
```

### Install dependencies

Backend

```bash
npm install
```

Frontend

```bash
npm install
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

```env
DATABASE_URL="your_supabase_database_url"
PORT=5000
```

---

## Database Setup

Push the Prisma schema to the database.

```bash
npx prisma db push
```

Generate the Prisma Client.

```bash
npx prisma generate
```

---

## Running the Application

### Backend

```bash
node server.js
```

Backend URL:

```text
http://localhost:5000
```

### Frontend

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

## CRUD Operations

The application supports:

- Create Homestay
- Read Homestays
- Update Homestay
- Delete Homestay
- Search Homestays

All data is stored in the Supabase PostgreSQL database.

---

## Future Enhancements

- AI-powered travel assistant
- Personalized recommendations
- User authentication
- Booking system
- Image uploads
- Reviews and ratings
- Payment gateway integration
- Admin dashboard

---

## Status

✅ Frontend Completed

✅ Backend API Developed

✅ Database Integrated using Supabase & Prisma

🚀 Ready for further feature development

---

## Author

**Sumedha Sharma**
