import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Admin from './pages/Admin'
import Public from './pages/Public'
import AdminLogin from './pages/AdminLogin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/claim" element={<Public />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
