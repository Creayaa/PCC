import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store'
import { FiLogOut, FiBell } from 'react-icons/fi'
import logo from '../assets/logo.png' // <-- Make sure you have your logo file here (e.g. src/assets/logo.png)

export default function Header() {
  const navigate = useNavigate()
  const { me, notifications, clearNotifications, logout } = useStore()
  const [showNotifs, setShowNotifs] = useState(false)

  const hasNew = notifications.length > 0

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header
      style={{
        background: 'linear-gradient(0deg, #7A1C10, #8E2413)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        flexWrap: 'wrap',
      }}
    >
      {/* --- LOGO + TITLE --- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img
          src={logo}
          alt="Padmashali Community Center"
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: '#fff',
            padding: 4,
            objectFit: 'contain',
            boxShadow: '0 0 4px rgba(0,0,0,0.3)',
          }}
        />
        <span
          style={{
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: 0.3,
          }}
        >
          Padmashali Community Center
        </span>
      </div>

      {/* --- ICONS: Notification Bell + Logout --- */}
      {me && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* --- Notification Bell --- */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFD95A',
                fontSize: 22,
                cursor: 'pointer',
                position: 'relative',
              }}
              title="Notifications"
            >
              <FiBell />
              {hasNew && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'red',
                  }}
                />
              )}
            </button>

            {/* --- Notification Dropdown --- */}
            {showNotifs && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 30,
                  background: '#fff',
                  color: '#333',
                  borderRadius: 8,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  width: 280,
                  maxHeight: 320,
                  overflowY: 'auto',
                  zIndex: 999,
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                {notifications.length === 0 ? (
                  <div style={{ padding: 10, color: '#777' }}>
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid #eee',
                        fontSize: 14,
                        background: '#fff',
                      }}
                    >
                      <strong style={{ color: '#7A1C10', display: 'block' }}>
                        {n.type.toUpperCase()}
                      </strong>
                      <div>{n.text}</div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#999',
                          marginTop: 3,
                        }}
                      >
                        {new Date(n.time).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}

                {notifications.length > 0 && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 8,
                      background: '#E59A00',
                      color: '#fff',
                      fontWeight: 600,
                      cursor: 'pointer',
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                      transition: 'background 0.2s ease',
                    }}
                    onClick={clearNotifications}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = '#cc8500')
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = '#E59A00')
                    }
                  >
                    Clear All
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- Logout Button --- */}
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFD95A',
              cursor: 'pointer',
              fontSize: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 6,
              borderRadius: 8,
              transition: 'background 0.2s ease',
            }}
            title="Logout"
            onMouseOver={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          >
            <FiLogOut />
          </button>
        </div>
      )}
    </header>
  )
}
