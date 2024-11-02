"use client";
import React, { useState, useEffect } from "react";
import Input from "./Input";
import { Task } from "@/types/index";
import { formatDate } from "@/lib/dateFormate";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { saveTask } from "@/store/taskSlice";
import { AppDispatch } from "@/store/store";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [isEditingDate, setIsEditingDate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTaskTitle(task.title);
        setTaskDescription(task.description);
        setTaskStatus(task.completed);
        const formattedDueDate = formatDate(task.dueDate);
        setDueDate(formattedDueDate);
        setIsEditingDate(false);
      } else {
        setTaskTitle("");
        setTaskDescription("");
        const today = new Date();
        const dueDateInTwoDays = new Date(today);
        dueDateInTwoDays.setDate(today.getDate() + 2);
        setDueDate(formatDate(dueDateInTwoDays.toISOString()));
        setIsEditingDate(true);
      }
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle || !taskDescription) return;

    const newTask: Task = {
      _id: task ? task._id : undefined,
      title: taskTitle,
      description: taskDescription,
      completed: taskStatus,
      dueDate: new Date(dueDate),
    };

    try {
      await dispatch(saveTask(newTask)).unwrap();
      alert("Task saved successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to create or update task:", error);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed z-[10] inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[60%] p-6 rounded shadow-md">
        <div className="text-xl text-black font-bold mb-4">
          {task ? "Update Task" : "Create Task"}
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            lable="Title"
            type="text"
            defaultValue={taskTitle}
            onChange={setTaskTitle}
            placeholder="Task Title"
            required
          />
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Task Description"
            className="bg-gray-700 border border-gray-300 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            rows={5}
            required
          />
          <select
            className="bg-gray-700 my-2 border border-gray-300 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={taskStatus ? "completed" : "incompleted"}
            onChange={(e) => setTaskStatus(e.target.value === "completed")}
          >
            <option value="incompleted">Incompleted</option>
            <option value="completed">Completed</option>
          </select>
          {task ? (
            <div>
              <Input
                lable="Due Date"
                onChange={setDueDate}
                type="text"
                defaultValue={dueDate}
                readOnly
                required={false}
              />
              <Button
                type="button"
                text="Edit Date"
                onClick={() => setIsEditingDate(true)}
                className="mb-2 bg-transparent text-blue-500 hover:underline"
              />
            </div>
          ) : (
            <Input
              lable="Due Date"
              type="datetime-local"
              defaultValue={dueDate}
              onChange={setDueDate}
              required={false}
            />
          )}

          {isEditingDate && task && (
            <div>
              <Input
                placeholder=""
                lable="Edit Due Date"
                type="datetime-local"
                value={dueDate}
                onChange={setDueDate}
                required={false}
              />
            </div>
          )}

          <Button
            type="submit"
            text={task ? "Update Task" : "Create Task"}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          />
          <Button
            type="button"
            text="Cancel"
            onClick={onClose}
            className="ml-2 bg-gray-700"
            disabled={false}
          />
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
