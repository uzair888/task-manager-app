"use client";
import React from "react";
import { useDispatch } from "react-redux";
import TaskRow from "./TaskRow";
import { deleteTask } from "@/store/taskSlice";
import { Task } from "../types";
import { AppDispatch } from "@/store/store";

interface TaskList {
  onEditTask: (task: Task) => void;
  tasks: Task[];
}
const TaskList = ({ onEditTask, tasks }: TaskList) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  return (
    <table className="border w-full">
      <thead className="border">
        <tr>
          <th className="pl-2 py-2 text-start">Title</th>
          <th className="pl-2 text-start">Description</th>
          <th className="pl-2 text-start">Status</th>
          <th className="pl-2 text-start">Due Date</th>
          <th className="pl-2 text-start">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.length !== 0 ? (
          <>
            {tasks.map((task) => (
              <TaskRow
                key={task._id}
                task={task}
                onEdit={() => onEditTask(task)}
                onDelete={() => handleDeleteTask(task._id as string)}
              />
            ))}
          </>
        ) : (
          <tr>
            <td className="p-2">No tasks created yet</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TaskList;
