import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import useStore from '../store'

export default function Layout({ children }) {
  const { loggedIn } = useStore()
  const location = useLocation()

  if (!loggedIn) return null

  return (
    <div>
      {/* Top Header */}
      <Header />

      {/* Main Layout */}
      <div className="layout">
        {/* Sidebar (Desktop only, hidden on mobile via CSS) */}
        <Sidebar />

        {/* Main Content */}
        <div style={{ paddingBottom: '70px' }}>{children}</div>
      </div>

      {/* Bottom Navigation (Mobile / Tablet) */}
      <div className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          <i>🏠</i>
          <span>Home</span>
        </NavLink>
        <NavLink to="/contacts" className={({ isActive }) => (isActive ? 'active' : '')}>
          <i>👥</i>
          <span>Contacts</span>
        </NavLink>
        <NavLink to="/ads" className={({ isActive }) => (isActive ? 'active' : '')}>
          <i>📢</i>
          <span>Ads</span>
        </NavLink>
        <NavLink to="/matrimony" className={({ isActive }) => (isActive ? 'active' : '')}>
          <i>💍</i>
          <span>Matrimony</span>
        </NavLink>
        <NavLink to="/chats" className={({ isActive }) => (isActive ? 'active' : '')}>
          <i>💬</i>
          <span>Chats</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
          <i>👤</i>
          <span>Profile</span>
        </NavLink>
      </div>
    </div>
  )
}
