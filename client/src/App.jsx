import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Otp from './pages/Otp'
import Register from './pages/Register'
import Home from './pages/Home'
import Contacts from './pages/Contacts'
import Ads from './pages/Ads'
import Matrimony from './pages/Matrimony'
import Profile from './pages/Profile'
import Layout from './components/Layout'
import useStore from './store'

// New chat pages
import ChatList from './pages/ChatList'
import ChatWindow from './pages/ChatWindow'

export default function App() {
  const { loggedIn } = useStore()

  if (!loggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/ads" element={<Ads />} />
        <Route path="/matrimony" element={<Matrimony />} />
        <Route path="/profile" element={<Profile />} />

        {/* Enhanced Chat System */}
        <Route path="/chats" element={<ChatList />} />
        <Route path="/chats/:chatId" element={<ChatWindow />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
