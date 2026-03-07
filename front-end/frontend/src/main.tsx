import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "@/app/router";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      {/* Global toast notifications */}
      <Toaster position="top-right" richColors closeButton />
      <AppRouter />
    </StrictMode>
  </BrowserRouter>,
);
