# PostScheduler — Social Media Content Scheduler

A full-stack app to create, schedule, and manage social media posts. Posts are automatically published when their scheduled time arrives.


## Tech Stack

**Backend:** Node.js · Express · SQLite (better-sqlite3)  
**Frontend:** React · Vite · React Router DOM

---

## Features

- Create and schedule posts across multiple platforms
- Auto-publishes posts when the scheduled time arrives
- Marks posts as failed if overdue by 10+ minutes
- Filter posts by status or platform
- Tags with live preview
- Full CRUD — create, edit, delete posts

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/patience9kyalo/social-media-scheduler.git
cd social-media-scheduler
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Run the app

```bash
# Terminal 1 — backend (port 3001)
cd backend && npm start

# Terminal 2 — frontend (port 5173)
cd frontend && npm run dev
```

Open `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create a post |
| PUT | `/api/posts/:id` | Update a post |
| DELETE | `/api/posts/:id` | Delete a post |
| GET | `/api/platforms` | Get all platforms |
| GET | `/api/tags` | Get all tags |

---

## Post Status Flow

```
draft → scheduled → published ✅
                 → failed ❌ (if 10+ mins overdue)
```

---

## License

[MIT](LICENSE)
