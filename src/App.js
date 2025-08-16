import React, { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./styles.css";

const API = "http://localhost:4000/api/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // load
  useEffect(() => {
    fetch(API).then(r => r.json()).then(setTasks).catch(console.error);
  }, []);

  // create
  async function handleAdd({ title, description, dueDate }) {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, dueDate }),
    });
    if (!res.ok) return alert("Create failed");
    const created = await res.json();
    setTasks(prev => [created, ...prev]);
  }

  // toggle complete
  async function handleToggle(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !t.completed }),
    });
    const updated = await res.json();
    setTasks(prev => prev.map(x => (x.id === id ? updated : x)));
  }

  // delete
  async function handleDelete(id) {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok) return alert("Delete failed");
    setTasks(prev => prev.filter(x => x.id !== id));
  }

  // start edit
  function startEdit(id) {
    setEditingId(id);
  }

  // save edit
  async function saveEdit(data) {
    const res = await fetch(`${API}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    setTasks(prev => prev.map(x => (x.id === editingId ? updated : x)));
    setEditingId(null);
  }

  const editingTask = tasks.find(t => t.id === editingId) || null;

  return (
    <div className="container">
      <h1>TaskFlow</h1>

      {/* Create or Edit */}
      {editingTask ? (
        <TaskForm
          initialValues={editingTask}
          onSubmit={saveEdit}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <TaskForm onSubmit={handleAdd} />
      )}

      {/* List */}
      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onEdit={startEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
