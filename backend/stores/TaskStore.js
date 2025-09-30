import { Task } from '../models/Task.js';

export class TaskStore {
  constructor() {
    this._tasks = [];
    this._nextId = 1;
  }

  all() {
    return this._tasks.map(t => t.toJSON());
  }

  create(data) {
    const task = new Task({ ...data, id: this._nextId++ });
    this._tasks.push(task);
    return task.toJSON();
  }

  findById(id) {
    return this._tasks.find(t => t.id === id) || null;
  }

  update(id, updates) {
    const task = this.findById(id);
    if (!task) return null;
    if (updates.title !== undefined) task.title = String(updates.title).trim();
    if (updates.description !== undefined) task.description = String(updates.description).trim();
    if (updates.completed !== undefined) task.completed = Boolean(updates.completed);
    if (updates.priority !== undefined) task.priority = updates.priority;
    return task.toJSON();
  }

  delete(id) {
    const idx = this._tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    const [removed] = this._tasks.splice(idx, 1);
    return removed.toJSON();
  }

  toggle(id) {
    const task = this.findById(id);
    if (!task) return null;
    task.completed = !task.completed;
    return task.toJSON();
  }
}

export default TaskStore;
