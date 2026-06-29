import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing-page";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Map" element={<Navigate to="/" replace />} />
      <Route path="/household" element={<Navigate to="/" replace />} />
      <Route path="/landuse" element={<Navigate to="/" replace />} />
      <Route path="/Tools" element={<Navigate to="/" replace />} />
      <Route path="/KPI" element={<Navigate to="/" replace />} />
      <Route path="/analytics" element={<Navigate to="/" replace />} />
      <Route path="/analytics/:section" element={<Navigate to="/" replace />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
