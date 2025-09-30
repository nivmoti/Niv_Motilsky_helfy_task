import React, { useState } from 'react';

export default function TaskItem({ task, onUpdate, onDelete, onToggle }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: task.title, description: task.description, priority: task.priority });

  const save = () => {
    if (!form.title.trim()) return;
    onUpdate(task.id, { ...form, title: form.title.trim(), description: form.description.trim() });
    setEditing(false);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <span className={`priority ${task.priority}`}></span>
      {editing ? (
        <div className="edit-row">
          <input value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} />
          <input value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} />
          <select value={form.priority} onChange={(e)=>setForm({...form, priority: e.target.value})}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button onClick={save}>Save</button>
          <button onClick={()=>setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="view-row">
          <div className="info">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <small>{new Date(task.createdAt).toLocaleString()}</small>
          </div>
          <div className="actions">
            <button onClick={()=>onToggle(task.id)}>{task.completed ? 'Undo' : 'Done'}</button>
            <button onClick={()=>setEditing(true)}>Edit</button>
            <button className="danger" onClick={()=>{ if (confirm('Delete this task?')) onDelete(task.id); }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
