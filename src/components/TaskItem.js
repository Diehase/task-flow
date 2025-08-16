import React from "react";

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const { title, description, completed, dueDate } = task;

  return (
    <li className={`task-item ${completed ? "done" : ""}`}>
      <div className="task-left">
        <input type="checkbox" checked={!!completed} onChange={onToggle} />
        <div className="task-content">
          <div className="task-title-row">
            <span className="task-title">{title}</span>
            {dueDate && (
              <span className="task-due">
                {new Date(dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
          {description && <p className="task-desc">{description}</p>}
        </div>
      </div>
      <div className="task-actions">
        <button className="btn btn-edit" onClick={onEdit}>Edit</button>
        <button className="btn btn-delete" onClick={onDelete}>Delete</button>
      </div>
    </li>
  );
}
