import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import LogDetail from './pages/LogDetail'
import LogsList from './pages/Logs'
import LogUpload from './pages/LogUpload'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/LogDetail" element={<LogDetail/>} />
        <Route path="/Logs" element={<LogsList/>} />
        <Route path="/LogUpload" element={<LogUpload/>} />
      </Routes>
    </>
  )
}

export default App
