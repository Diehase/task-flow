import React, { useEffect, useState } from "react";

export default function TaskForm({ onSubmit, initialValues, onCancel }) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [dueDate, setDueDate] = useState(
    initialValues?.dueDate ? toInputDate(initialValues.dueDate) : ""
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || "");
      setDescription(initialValues.description || "");
      setDueDate(initialValues.dueDate ? toInputDate(initialValues.dueDate) : "");
    }
  }, [initialValues]);

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
    });
    if (!initialValues) {
      setTitle(""); setDescription(""); setDueDate("");
    }
  }

  return (
    <form className="task-form" onSubmit={submit}>
      <h3>{initialValues ? "Edit Task" : "Create Task"}</h3>

      <label className="field">
        <span>Title *</span>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter task title" />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
      </label>

      <label className="field">
        <span>Due date</span>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      </label>

      {error && <div className="form-error">{error}</div>}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialValues ? "Save changes" : "Add task"}
        </button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}

function toInputDate(value) {
  const d = new Date(value);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
