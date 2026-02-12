import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useLenis } from "./hooks/useLenis";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import {
  IVRDashboard,
  AgentConfig,
  MockDataManager,
  TestingSuite,
  CallLogs,
  IVRSettings,
} from "./pages/IVR";

export default function App() {
  useLenis();

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* IVR Management Layout */}
          <Route element={<AppLayout />}>
            {/* Redirect root to IVR Dashboard */}
            <Route index path="/" element={<Navigate to="/ivr" replace />} />

            {/* IVR Management Routes */}
            <Route path="/ivr" element={<IVRDashboard />} />
            <Route path="/ivr/dashboard" element={<IVRDashboard />} />
            <Route path="/ivr/agent-config" element={<AgentConfig />} />
            <Route path="/ivr/mock-data" element={<MockDataManager />} />
            <Route path="/ivr/testing" element={<TestingSuite />} />
            <Route path="/ivr/logs" element={<CallLogs />} />
            <Route path="/ivr/settings" element={<IVRSettings />} />
          </Route>

          {/* Catch all - redirect to IVR */}
          <Route path="*" element={<Navigate to="/ivr" replace />} />
        </Routes>
      </Router>
    </>
  );
}
