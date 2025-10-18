import React from 'react'
import { NavLink } from 'react-router-dom'
import useStore from '../store'

// Reusable Nav item
const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => 'navlink' + (isActive ? ' active' : '')}
  >
    {children}
  </NavLink>
)

export default function Sidebar() {
  const { me } = useStore()

  return (
    <aside className="sidebar">
      {/* User Info Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          borderBottom: '1px solid #E7DCC6',
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: '#FFD95A',
            border: '3px solid #7A1C10',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#7A1C10',
            fontSize: 18,
          }}
        >
          {me?.firstName?.[0]?.toUpperCase() || 'P'}
        </div>

        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontWeight: 800, color: '#7A1C10', fontSize: 16 }}>
            {me
              ? `${me.firstName || ''} ${me.lastName || ''}`.trim()
              : 'Guest User'}
          </div>
          <div style={{ fontSize: 12, color: '#7a6a55' }}>
            {me?.profession || 'Community Member'}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <NavItem to="/">🏠 Home</NavItem>
        <NavItem to="/contacts">👥 Contacts</NavItem>
        <NavItem to="/ads">📢 Ads</NavItem>
        <NavItem to="/matrimony">💍 Matrimony</NavItem>
        <NavItem to="/chats">💬 Chats</NavItem>
        <NavItem to="/profile">👤 Profile</NavItem>
      </nav>
    </aside>
  )
}
