import React, { useState, useEffect } from 'react';
import { api } from './api';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => { loadTodos(); }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to connect to backend. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) { setFormError('Title cannot be empty'); return; }
    try {
      const newTodo = await api.createTodo({ title: formTitle, description: formDesc });
      setTodos([newTodo, ...todos]);
      setFormTitle(''); setFormDesc(''); setFormError(''); setShowForm(false);
    } catch (err) { setFormError(err.message); }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await api.toggleTodo(id);
      setTodos(todos.map(t => t.id === id ? updated : t));
    } catch (err) { setError(err.message); }
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
    setEditDesc(todo.description || '');
  };

  const handleUpdate = async (id) => {
    if (!editTitle.trim()) return;
    try {
      const updated = await api.updateTodo(id, { title: editTitle, description: editDesc });
      setTodos(todos.map(t => t.id === id ? updated : t));
      setEditId(null);
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) { setError(err.message); }
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-bracket">[</span>
            <span className="logo-text">TODO</span>
            <span className="logo-bracket">]</span>
          </div>
          <div className="stats">
            <span className="stat active-stat">{activeCount} active</span>
            <span className="stat-divider">/</span>
            <span className="stat done-stat">{completedCount} done</span>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="add-section">
          {!showForm ? (
            <button className="btn-add" onClick={() => setShowForm(true)}>
              <span className="btn-add-icon">+</span>
              <span>New Task</span>
            </button>
          ) : (
            <form className="todo-form" onSubmit={handleCreate}>
              <div className="form-header">
                <span className="form-title-label">NEW TASK</span>
                <button type="button" className="btn-close" onClick={() => { setShowForm(false); setFormError(''); }}>✕</button>
              </div>
              <input
                className="form-input" type="text" placeholder="Task title *"
                value={formTitle} onChange={e => setFormTitle(e.target.value)} autoFocus
              />
              <textarea
                className="form-textarea" placeholder="Description (optional)"
                value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3}
              />
              {formError && <p className="form-error">{formError}</p>}
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => { setShowForm(false); setFormError(''); }}>Cancel</button>
                <button type="submit" className="btn-submit">Add Task</button>
              </div>
            </form>
          )}
        </div>

        <div className="filters">
          {['all', 'active', 'completed'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠ {error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner" />
            <span>Connecting to backend...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">◎</div>
            <p>{filter === 'all' ? 'No tasks yet. Add your first task!' : `No ${filter} tasks.`}</p>
          </div>
        ) : (
          <ul className="todo-list">
            {filtered.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                {editId === todo.id ? (
                  <div className="edit-form">
                    <input className="edit-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} autoFocus />
                    <textarea className="edit-textarea" value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2} />
                    <div className="edit-actions">
                      <button className="btn-cancel-sm" onClick={() => setEditId(null)}>Cancel</button>
                      <button className="btn-save" onClick={() => handleUpdate(todo.id)}>Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button className={`checkbox ${todo.completed ? 'checked' : ''}`} onClick={() => handleToggle(todo.id)}>
                      {todo.completed ? '✓' : ''}
                    </button>
                    <div className="todo-content">
                      <p className="todo-title">{todo.title}</p>
                      {todo.description && <p className="todo-desc">{todo.description}</p>}
                      <p className="todo-date">{new Date(todo.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="todo-actions">
                      <button className="btn-edit" onClick={() => startEdit(todo)}>✎</button>
                      <button className="btn-delete" onClick={() => handleDelete(todo.id)}>⌫</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;