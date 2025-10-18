import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store'
import logo from '../assets/logo.png'

export default function Register() {
  const nav = useNavigate()
  const { register } = useStore()

  const onSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await register({
      firstName: fd.get('firstName'),
      lastName: fd.get('lastName'),
      gothram: fd.get('gothram'),
      profession: fd.get('profession'),
      city: fd.get('city'),
      state: fd.get('state'),
      country: fd.get('country'),
    })
    nav('/')
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
          maxWidth: 500,
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
          Member Registration
        </h2>

        <form onSubmit={onSubmit}>
          <div className="grid2">
            <input
              className="input"
              name="firstName"
              placeholder="First Name"
              required
            />
            <input
              className="input"
              name="lastName"
              placeholder="Last Name"
              required
            />
          </div>
          <input className="input" name="gothram" placeholder="Gothram" />
          <input className="input" name="profession" placeholder="Profession" />
          <div className="grid2">
            <input className="input" name="city" placeholder="City" />
            <input className="input" name="state" placeholder="State" />
          </div>
          <input className="input" name="country" placeholder="Country" />

          <button className="btn" style={{ marginTop: 10, width: '100%' }}>
            Register & Continue
          </button>
        </form>
      </div>
    </div>
  )
}
