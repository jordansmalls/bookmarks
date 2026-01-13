import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import store from "./store.ts";
import { Provider } from "react-redux";

import Login from "./pages/auth/login.tsx";
import Signup from "./pages/auth/signup.tsx";
import NotFound from "./pages/not-found.tsx";
import Dashboard from "./pages/dashboard.tsx";
import Settings from "./pages/settings.tsx";
import PrivateRoute from "./components/private-route.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Navigate to="/dashboard" replace />} />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>,
);
