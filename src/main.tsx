import { StrictMode } from "react";
import "./Root";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./scrollbar.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);


