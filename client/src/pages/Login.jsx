import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store'
import logo from '../assets/logo.png' // place your image in /src/assets/logo.png

export default function Login() {
  const nav = useNavigate()
  const { phone, setPhone, sendOtp } = useStore()

  const submit = async (e) => {
    e.preventDefault()
    await sendOtp()
    nav('/otp')
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
        <img
          src={logo}
          alt="Padmashali Community Center"
          style={{ width: 120, marginBottom: 10 }}
        />
        <h2 style={{ marginTop: 0, color: '#7A1C10' }}>
          Padmashali Community Center
        </h2>
        <p style={{ color: '#7a6a55' }}>OTP-based login (demo OTP: 123456)</p>

        <form onSubmit={submit}>
          <input
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />
          <button className="btn" style={{ marginTop: 10, width: '100%' }}>
            Send OTP
          </button>
        </form>
      </div>
    </div>
  )
}
