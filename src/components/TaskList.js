import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks = [], onToggle, onEdit, onDelete }) {
  if (!tasks.length) {
    return <div className="empty">No tasks yet. Create your first one!</div>;
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onEdit={() => onEdit(task.id)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </ul>
  );
}
