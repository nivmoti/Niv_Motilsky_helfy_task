# Task Manager

Small React + Express app with in‑memory tasks. Create, edit, delete, toggle, and filter. The task list is shown as a simple carousel.

## Run it
Backend (port 4000):
```powershell
cd Niv_Motilsky_helfy_task/backend
npm install
npm start
```
Frontend (port 3000):
```powershell
cd Niv_Motilsky_helfy_task/frontend
npm install
npm start
```

## API (quick)
- GET /api/tasks
- POST /api/tasks  — body: { title (required), description?, priority: low|medium|high }
- PUT /api/tasks/:id  — any of { title, description, completed, priority }
- DELETE /api/tasks/:id
- PATCH /api/tasks/:id/toggle

Model shape:
```json
{ "id": 1, "title": "t", "description": "d", "completed": false, "createdAt": "ISO", "priority": "low|medium|high" }
```

## Frontend
- Components: App, TaskList, TaskItem, TaskForm, TaskFilter
- Carousel: index‑based (autoplay, arrows, dots). Inspired by this approach:
  https://github.com/JohanAlves/yt-react-carousel
- No UI libraries. Plain CSS.

## Notes
- Backend: Express + CORS + ESM, runs on 4000
- In memory only (array). OOP store + model
- Basic validation (title required, types, priority)

## Assumptions
- Keep it simple and responsive
- Error states are minimal but visible
- Intended for local demo, not production

## Time (fill in)
- Backend: 30 mins
- Frontend: 90 mins
- Styling/Polish: 60 mins
- Debugging: 20 mins
