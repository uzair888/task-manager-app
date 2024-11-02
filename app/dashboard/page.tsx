"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchTasks, addOrUpdateTask } from "@/store/taskSlice";
import TaskList from "@/components/TaskList";
import TaskModal from "@/components/TaskModal";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { Task } from "@/types/index";
import Pagination from "@/components/Pagination";
import ThemeToggle from "@/components/ThemeToggle";

const ITEMS_PER_PAGE = 3;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { tasks, loading, error, unauthorized } = useSelector(
    (state: RootState) => state.tasks
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "GET",
    });
    router.push("/login");
  };
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (unauthorized) {
      router.push("/login");
    }
  }, [unauthorized, router]);

  const openModal = (task: Task | null = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskCreatedOrUpdated = (task: Task) => {
    dispatch(addOrUpdateTask(task));
    closeModal();
  };

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
  const currentTasks = tasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="dashboard-container">
      <div className="text-center mt-6 text-3xl">Welcome to the Dashboard</div>

      {error && <div className="error-message">Error: {error}</div>}

      <div className="mx-auto w-[80%]">
        <ThemeToggle />
        <Button
          type="button"
          className="p-2 ml-3 bg-red-500 rounded mb-3"
          text="Logout"
          onClick={handleLogout}
        />
        <Button
          type="button"
          className="float-right bg-blue-500 mb-3"
          text="Add New Task"
          onClick={() => openModal()}
        />

        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          task={selectedTask}
          onSave={handleTaskCreatedOrUpdated}
        />

        {loading ? (
          <div>Loading tasks...</div>
        ) : (
          <>
            <TaskList tasks={currentTasks} onEditTask={openModal} />
            {tasks.length > 3 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
