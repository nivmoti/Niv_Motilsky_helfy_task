import { Router } from 'express';
import TaskStore from '../stores/TaskStore.js';
import { validateCreateTask, validateUpdateTask } from '../middleware/validateTask.js';

const router = Router();

// In-memory store instance
const store = new TaskStore();

// GET /api/tasks
router.get('/', (_req, res) => {
  res.json(store.all());
});

// POST /api/tasks
router.post('/', validateCreateTask, (req, res) => {
  const created = store.create(req.body);
  res.status(201).json(created);
});

// PUT /api/tasks/:id
router.put('/:id', validateUpdateTask, (req, res) => {
  const id = Number(req.params.id);
  const updated = store.update(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json(updated);
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const deleted = store.delete(id);
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.json(deleted);
});

// PATCH /api/tasks/:id/toggle
router.patch('/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  const toggled = store.toggle(id);
  if (!toggled) return res.status(404).json({ error: 'Task not found' });
  res.json(toggled);
});

export default router;
