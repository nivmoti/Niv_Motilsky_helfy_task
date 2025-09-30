export const PRIORITIES = ['low', 'medium', 'high'];

export function validateCreateData(body) {
  const { title, description, priority } = body ?? {};
  const errors = [];
  if (typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string.');
  }
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string.');
  }
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    errors.push("Priority must be one of: 'low', 'medium', 'high'.");
  }
  return errors;
}

export function validateUpdateData(body) {
  const { title, description, priority, completed } = body ?? {};
  const errors = [];
  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    errors.push('If provided, title must be a non-empty string.');
  }
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string.');
  }
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    errors.push("Priority must be one of: 'low', 'medium', 'high'.");
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push('Completed must be a boolean.');
  }
  return errors;
}

// Express middleware wrappers (still usable in routes if desired)
export function validateCreateTask(req, res, next) {
  const errors = validateCreateData(req.body);
  if (errors.length) return res.status(400).json({ errors });
  next();
}

export function validateUpdateTask(req, res, next) {
  const errors = validateUpdateData(req.body);
  if (errors.length) return res.status(400).json({ errors });
  next();
}
