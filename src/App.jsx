import { Routes, Route } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import WatchFace from './pages/Watch'
import HealthAnalytics from './pages/Card'
import Location from './pages/Location'
import Communication from './pages/Communication' 

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/watch" element={<WatchFace />} />
      <Route path="/Card" element={<HealthAnalytics />} />
      <Route path="/Location" element={<Location />} />
      <Route path="/communication" element={<Communication />} />

    </Routes>
  )
}

export default App
