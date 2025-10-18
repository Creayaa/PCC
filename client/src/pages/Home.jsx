import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store'

export default function Home() {
  const navigate = useNavigate()
  const { loadAll, ads, matrimony, users } = useStore()

  useEffect(() => { loadAll() }, [])

  const recentAds = ads.slice(0, 3)
  const recentMatrimony = matrimony.slice(0, 3)
  const recentUsers = users.slice(-3).reverse()

  return (
    <div className="home-container">
      {/* Banner */}
      <div className="banner">
        <h1>Padmashali Community Center</h1>
        <p>Connecting People • Building Bonds • Empowering Our Community</p>
      </div>

      {/* Quick Action Buttons */}
      <div className="quick-actions">
        <button className="btn" onClick={() => navigate('/ads')}>Browse Ads</button>
        <button className="btn" onClick={() => navigate('/matrimony')}>Find Matches</button>
        <button className="btn" onClick={() => navigate('/contacts')}>View Contacts</button>
      </div>

      {/* Sections */}
      <div className="section">
        <h2>📢 Recent Ads</h2>
        <div className="card-grid">
          {recentAds.length === 0 ? (
            <p>No recent ads yet.</p>
          ) : (
            recentAds.map(ad => (
              <div key={ad.id} className="card ad-card">
                <div className="ad-title">{ad.title || 'Untitled Ad'}</div>
                <div className="ad-desc">{ad.description || 'No description provided.'}</div>
                {ad.location && <div className="ad-loc">📍 {ad.location}</div>}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="section">
        <h2>💍 Recent Matrimony Profiles</h2>
        <div className="card-grid">
          {recentMatrimony.length === 0 ? (
            <p>No recent profiles yet.</p>
          ) : (
            recentMatrimony.map(mat => (
              <div key={mat.id} className="card mat-card">
                <div className="mat-name">{mat.name || 'Profile'}</div>
                <div className="mat-profession">{mat.profession || 'Profession not specified'}</div>
                <div className="mat-gothram">Gothram: {mat.gothram || 'N/A'}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="section">
        <h2>🧑‍🤝‍🧑 Recently Joined Members</h2>
        <div className="card-grid">
          {recentUsers.length === 0 ? (
            <p>No members yet.</p>
          ) : (
            recentUsers.map(u => (
              <div key={u.id} className="card user-card">
                <div className="user-avatar">{u.firstName?.[0]}{u.lastName?.[0]}</div>
                <div className="user-info">
                  <div className="user-name">{u.firstName} {u.lastName}</div>
                  <div className="user-profession">{u.profession || 'Member'}</div>
                  <div className="user-city">{u.city || ''}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
