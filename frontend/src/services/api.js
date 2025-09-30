const BASE = '/api';

export async function getTasks() {
  const res = await fetch(`${BASE}/tasks`);
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export async function createTask(payload) {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export async function updateTask(id, payload) {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('failed');
}

export async function toggleTask(id) {
  const res = await fetch(`${BASE}/tasks/${id}/toggle`, { method: 'PATCH' });
  if (!res.ok) throw new Error('failed');
  return res.json();
}
