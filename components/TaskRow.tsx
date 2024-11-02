"use client";
import React from "react";
import Button from "./Button";
import { Task } from "@/types/index";
import { formatDueDate } from "@/lib/dateFormate";

interface TaskRowProps {
  onEdit: () => void;
  task: Task;
  onDelete: () => void;
}
const TaskRow = ({ task, onEdit, onDelete }: TaskRowProps) => {
  return (
    <tr>
      <td className="px-2 py-2">{task.title}</td>
      <td className="px-2 py-2">{task.description}</td>
      <td className="px-2 py-2">
        {task.completed ? "Completed" : "Incompleted"}
      </td>
      <td className="px-2 py-2">{formatDueDate(task.dueDate)}</td>
      <td className="px-2 py-2">
        <Button
          type="button"
          text="Edit"
          onClick={onEdit}
          className="bg-blue-500 mr-4"
        />
        <Button
          type="button"
          text="Delete"
          onClick={onDelete}
          className="bg-red-500"
        />
      </td>
    </tr>
  );
};

export default TaskRow;
