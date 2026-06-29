import { Navigate, createBrowserRouter } from "react-router-dom";

import { App } from "./App";
import { LoginPage } from "../features/auth/LoginPage";
import { TaskDetailPage } from "../features/tasks/TaskDetailPage";
import { TaskListPage } from "../features/tasks/TaskListPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/tasks" replace />,
      },
      {
        path: "tasks",
        element: <TaskListPage />,
      },
      {
        path: "tasks/:taskId",
        element: <TaskDetailPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
