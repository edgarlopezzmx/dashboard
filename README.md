# Saas Dashboard - Next.js 15
This project is a small but realistic Saas-style dashboard built using Netx.js 15 with the App Router, Server Components and Server Actions. It displays a list of Projects and the Events they receive through a weebhook endpoint.

## 🚀 Live Demo

[https://dashboard-ochre-phi.vercel.app](dashboard-ochre-phi.vercel.app)


## Quick Start

First, run the development server:

```bash
pnpm install
pnpm db:generate
pnpm db:seed
pnpm dev
```

Then visit [http://localhost:3000/dashboard/projects](http://localhost:3000/dashboard/projects)


## Setup database

Create the **.env** file, You can execute
```bash
cat .env.example > .env
```
Execute the generator of the database
```bash
pnpx prisma migrate dev --name init
pnpx prisma generate
```

run the seeder
```bash
pnpm db:seed
```

## Architecture Notes

* Routing: App Router (App/), using Server Components only
* Data Layer: Prisma ORM + SQLite for simplicity and local speed
* UI: TailwindCSS + semantic HTML for minimal, clean styling
* State& Actions: Form submissions use Server Action only (no client state)
* Revalidation: Revalidates project and event pages after create/delete/event
* Error Handling: Includes optimistic UI, 400/500 HTTP handling in APIs


## Data Models

``` prisma
model Project {
  id          String   @id @default(cuid())
  name        String
  description String
  createdAt   DateTime @default(now())
  events      Event[]
}

model Event {
  id        String   @id @default(cuid())
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId String
  type      String
  payload   Json
  createdAt DateTime @default(now())
}
```

## Pages & Features

```table
Route                                   Description
/dashboard/projects                     List all projects
/dashboard/create                       Create a new project (Server Action)
/dashboard/projects/[id]                View project details + events
POST /api/projects/[id]/events          Webhook to log event for a project
```

## Webhook Testing

**Endpoint**
```
POST /api/projects/<projectId>/events
Content-Type: application/json
```
**Body Example**
```
{
  "type": "order.created",
  "payload": {
    "orderId": "A1B2C3",
    "amount": 49.99
  }
}
```

**cURL example**
```
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "type": "order.created",
    "payload": { "orderId": "A1B2C3", "amount": 49.99 }
  }' \
  https://dashboard-ochre-phi.vercel.app/api/projects/cmccgpct30002jp042ik5v9hg/events
```

## Seeding Data
use the following command to generate 3 project with 20 events:
```
pnpm db:seed
```

## Environment Variables
Create a .env file based on the following template:

```
#SQLite
DATABASE_URL="file:./dev.db"

#PostgreSQL
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
```

## Deployment
This project is deployed on Vercel. It uses:
* pnpm install
* pnpm db:generate
* prisma migrate deploy
* pnpm db:seed