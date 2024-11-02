import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "@/types/index";
import { RootState } from "@/store/store";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  unauthorized: boolean;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  unauthorized: false,
};

// Fetch tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    const response = await fetch("http://localhost:3000/api/tasks", {
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (response.status === 401) {
      return rejectWithValue("unauthorized");
    }

    const data = await response.json();
    return data;
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string, { rejectWithValue }) => {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.status === 401) {
      return rejectWithValue("unauthorized");
    }

    return taskId;
  }
);

// Create or update task
export const saveTask = createAsyncThunk(
  "tasks/saveTask",
  async (task: Task, { rejectWithValue }) => {
    const method = task._id ? "PUT" : "POST"; // Use PUT if task has an ID
    const url = task._id
      ? `http://localhost:3000/api/tasks/${task._id}`
      : `http://localhost:3000/api/tasks`;

    const response = await fetch(url, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (response.status === 401) {
      return rejectWithValue("unauthorized");
    }

    if (!response.ok) {
      throw new Error("Failed to save task");
    }

    const newTask = await response.json();
    return newTask;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Reducer to handle adding or updating tasks locally
    addOrUpdateTask: (state, action: PayloadAction<Task>) => {
      const existingTaskIndex = state.tasks.findIndex(
        (task) => task._id === action.payload._id
      );
      if (existingTaskIndex >= 0) {
        state.tasks[existingTaskIndex] = action.payload;
      } else {
        state.tasks.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.unauthorized = false;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        if (action.payload === "unauthorized") {
          state.unauthorized = true;
        }
        state.error = action.error.message || "Failed to fetch tasks";
        state.loading = false;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(saveTask.fulfilled, (state, action) => {
        const existingTaskIndex = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (existingTaskIndex >= 0) {
          state.tasks[existingTaskIndex] = action.payload; // Update existing task
        } else {
          state.tasks.push(action.payload); // Add new task
        }
      })
      .addCase(saveTask.rejected, (state, action) => {
        if (action.payload === "unauthorized") {
          state.unauthorized = true;
        }
        state.error = action.error.message || "Failed to save task";
      });
  },
});

export const { addOrUpdateTask } = taskSlice.actions;

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectLoading = (state: RootState) => state.tasks.loading;
export const selectError = (state: RootState) => state.tasks.error;
export const selectUnauthorized = (state: RootState) =>
  state.tasks.unauthorized;

export default taskSlice.reducer;
