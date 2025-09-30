import { PRIORITIES, validateCreateData, validateUpdateData } from '../middleware/validateTask.js';

export class Task {
  constructor({ id, title, description = '', priority = 'low', completed = false, createdAt } = {}) {
    this.id = id;
    this.title = String(title).trim();
    this.description = String(description ?? '').trim();
    this.completed = Boolean(completed);
    this.createdAt = createdAt ?? new Date().toISOString();
    this.priority = PRIORITIES.includes(priority) ? priority : 'low';
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt,
      priority: this.priority,
    };
  }

  static validateCreate(body) { return validateCreateData(body); }
  static validateUpdate(body) { return validateUpdateData(body); }
}

export default Task;
