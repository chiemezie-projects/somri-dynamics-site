import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter, Routes, Route } from "react-router-dom"
import "./index.css"
import App from "./App"
import ListingsPage from "./pages/ListingsPage"
import AdminPage from "./pages/AdminPage"
import { CopyProvider } from "./components/copy-context"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <CopyProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<App />} />
        </Routes>
      </CopyProvider>
    </HashRouter>
  </StrictMode>,
)
