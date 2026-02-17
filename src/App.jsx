import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import WatchFace from './pages/Watch'
import HealthAnalytics from './pages/Card'
import Location from './pages/Location'
import Communication from './pages/Communication'
import { MissionProvider } from './context/MissionContext'
import OperativeLayout from './layouts/OperativeLayout'

function App() {
  return (
    <MissionProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/watch" element={<WatchFace />} />

        {/* Nested Operative Routes */}
        <Route path="/operative/:soldierId" element={<OperativeLayout />}>
          <Route index element={<Navigate to="vitals" replace />} />
          <Route path="vitals" element={<HealthAnalytics />} />
          <Route path="location" element={<Location embedded />} />
          <Route path="communication" element={<Communication embedded />} />
        </Route>

        {/* Legacy/Direct Access Fallbacks (Optional, or redirect) */}
        <Route path="/Location" element={<Location />} />
        <Route path="/communication" element={<Communication />} />

        {/* specific route rename fallback/redirect if needed, but we removed /operative-status */}
      </Routes>
    </MissionProvider>
  )
}

export default App
