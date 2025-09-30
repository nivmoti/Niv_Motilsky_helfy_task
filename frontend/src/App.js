import React, { useEffect, useState } from 'react';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskFilter from './components/TaskFilter.jsx';
import { getTasks, createTask, updateTask, deleteTask, toggleTask } from './services/api.js';
import './styles/app.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all | completed | pending
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  const handleAdd = async (payload) => {
    try {
      const created = await createTask(payload);
      setTasks(prev => [...prev, created]);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updated = await updateTask(id, updates);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await toggleTask(id);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      setError('Failed to toggle task');
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Task Manager</h1>
      </header>

      <TaskForm onSubmit={handleAdd} />
      <TaskFilter value={filter} onChange={setFilter} />

      {loading && <p className="status">Loading…</p>}
      {error && <p className="status error">{error}</p>}

      <TaskList
        tasks={filtered}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
    </div>
  );
}
