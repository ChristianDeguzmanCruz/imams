# IMAMS - Inventory Management and Monitoring System

A web app for tracking construction materials: add materials with quantity and unit, monitor the full list, update quantities, and delete items.

## Features
- Add a material with name, quantity, and unit
- View all materials with their item ID
- Update a material's quantity
- Delete a material

## Tech Stack
- Node.js and Express (backend)
- PostgreSQL on Neon (database)
- HTML, CSS, and vanilla JavaScript (frontend)

## Getting Started
1. Clone the repo and install dependencies:
```bash
   npm install
```
2. Create a `.env` file (see `.env.example`) with your Neon connection string.
3. Create the table in your database:
```sql
   CREATE TABLE materials (
     item_id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     quantity NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (quantity >= 0),
     unit TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
```
4. Start the server:
```bash
   node server.js
```
5. Open http://localhost:3000

## API Endpoints
| Method | Route | Description |
|---|---|---|
| GET | /materials | List all materials |
| POST | /materials | Add a material |
| PUT | /materials/:id | Update quantity |
| DELETE | /materials/:id | Delete a material |