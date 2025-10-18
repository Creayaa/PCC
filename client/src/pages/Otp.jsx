import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store'
import logo from '../assets/logo.png' // place your logo file inside src/assets/logo.png

export default function Otp() {
  const nav = useNavigate()
  const { otp, setOtp, verifyOtp } = useStore()

  const submit = async (e) => {
    e.preventDefault()
    const result = await verifyOtp()
    if (result === 'register') nav('/register')
    else nav('/')
  }

  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: 'calc(100vh - 56px)',
        padding: 16,
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Logo and title */}
        <img
          src={logo}
          alt="Padmashali Community Center"
          style={{
            width: 120,
            marginBottom: 10,
          }}
        />
        <h2 style={{ marginTop: 0, color: '#7A1C10' }}>
          Padmashali Community Center
        </h2>

        {/* OTP form */}
        <h3 style={{ marginTop: 0, color: '#7A1C10' }}>Verify OTP</h3>
        <p style={{ marginTop: -8, color: '#7a6a55' }}>
          Enter 6-digit code (use 123456)
        </p>
        <form onSubmit={submit}>
          <input
            className="input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
          />
          <button className="btn" style={{ marginTop: 10, width: '100%' }}>
            Verify
          </button>
        </form>
      </div>
    </div>
  )
}
