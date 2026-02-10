import { Routes, Route } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import WatchFace from './pages/watch'
import HealthAnalytics from './pages/Card'
import Location from './pages/Location'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/watch" element={<WatchFace />} />
      <Route path="/Card" element={<HealthAnalytics />} />
      <Route path="/location" element={<Location />} />

    </Routes>
  )
}

export default App
