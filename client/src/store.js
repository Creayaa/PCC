import { create } from 'zustand'
import axios from 'axios'
import { io } from 'socket.io-client'

// =========================================================
//  API + SOCKET
// =========================================================
const API = axios.create({ baseURL: 'http://localhost:4000' })
const socket = io('http://localhost:4000', { autoConnect: false })

// =========================================================
//  SESSION HELPERS
// =========================================================
const persistState = (state) => {
  const { me, loggedIn, phone } = state
  localStorage.setItem('padmashali_session', JSON.stringify({ me, loggedIn, phone }))
}

const loadPersisted = () => {
  try {
    const data = localStorage.getItem('padmashali_session')
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

const initial = loadPersisted()

// =========================================================
//  STORE
// =========================================================
const useStore = create((set, get) => ({
  phone: initial.phone || '',
  otp: '',
  me: initial.me || null,
  loggedIn: initial.loggedIn || false,

  users: [],
  ads: [],
  matrimony: [],
  chats: [],
  activeChatId: null,
  notifications: [],

  // ---------------- SETTERS ----------------
  setPhone: (v) => {
    set({ phone: v })
    persistState(get())
  },
  setOtp: (v) => set({ otp: v }),
  setActiveChatId: (id) => set({ activeChatId: id }),

  // ---------------- AUTH ----------------
  sendOtp: async () => {
    const { phone } = get()
    await API.post('/auth/send-otp', { phone })
    return true
  },

  verifyOtp: async () => {
    const { phone, otp } = get()
    const r = await API.post('/auth/verify-otp', { phone, code: otp })
    if (!r.data.ok) throw new Error('Invalid OTP')

    if (r.data.exists) {
      set({ me: r.data.user, loggedIn: true })
      persistState(get())
      socket.connect()
    } else return 'register'
    return 'home'
  },

  register: async (p) => {
    const { phone } = get()
    const r = await API.post('/auth/register', { phone, ...p })
    set({ me: r.data.user, loggedIn: true })
    persistState(get())
    socket.connect()
  },

  logout: () => {
    socket.disconnect()
    set({
      me: null,
      loggedIn: false,
      phone: '',
      otp: '',
      chats: [],
      notifications: [],
    })
    localStorage.removeItem('padmashali_session')
  },

  // ---------------- LOAD ALL ----------------
  loadAll: async () => {
    const [u, a, m, c] = await Promise.all([
      API.get('/users'),
      API.get('/ads'),
      API.get('/matrimony'),
      API.get('/chats'),
    ])
    set({ users: u.data, ads: a.data, matrimony: m.data, chats: c.data })
    c.data.forEach((chat) => socket.emit('join', chat.id))
  },

  // ---------------- CHAT ----------------
  ensureJoined: (chatId) => socket.emit('join', chatId),

  openChat: async (userId) => {
    const { users, me } = get()
    let user2 = userId

    if (typeof userId === 'string') {
      const found = users.find(
        (u) =>
          `${u.firstName} ${u.lastName}`.trim().toLowerCase() === userId.trim().toLowerCase()
      )
      if (found) user2 = found.id
    }

    const r = await API.post('/chats', { user1: me.id, user2 })
    set({ chats: [r.data, ...get().chats], activeChatId: r.data.id })
    socket.emit('join', r.data.id)
    return r.data.id
  },

  sendMessage: (chatId, text) => {
    const { me, chats } = get()
    if (!chatId || !me || !text.trim()) return

    const newMsg = {
      id: Date.now(),
      chatId: Number(chatId),
      senderId: me.id,
      senderName: `${me.firstName} ${me.lastName}`.trim(),
      text,
      timestamp: new Date().toISOString(),
    }

    const updatedChats = chats.map((c) =>
      c.id === Number(chatId)
        ? { ...c, messages: [...(c.messages || []), newMsg] }
        : c
    )
    set({ chats: updatedChats })
    socket.emit('sendMessage', newMsg)
  },

  // ---------------- ADS & MATRIMONY ----------------
  postAd: async (data) => {
    const { me, ads } = get()
    const r = await API.post('/ads', { ...data, by: me?.id })
    set({ ads: [r.data, ...ads] })
    socket.emit('newAd', r.data)
  },

  addMatrimony: async (data) => {
    const { me, matrimony } = get()
    const r = await API.post('/matrimony', { ...data, by: me?.id })
    set({ matrimony: [r.data, ...matrimony] })
    socket.emit('newMatrimony', r.data)
  },

  // ---------------- NOTIFICATIONS ----------------
  addNotification: (note) => {
    const { notifications } = get()
    set({ notifications: [note, ...notifications].slice(0, 20) })
  },
  clearNotifications: () => set({ notifications: [] }),
}))

// =========================================================
//  SOCKET EVENT HANDLERS
// =========================================================

// ---- REALTIME MESSAGE ----
socket.on('message', (msg) => {
  const { chats, addNotification, me } = useStore.getState()
  if (!msg?.chatId) return

  const updatedChats = chats.map((c) =>
    c.id === msg.chatId ? { ...c, messages: [...(c.messages || []), msg] } : c
  )
  useStore.setState({ chats: updatedChats })

  if (msg.senderId !== me?.id) {
    addNotification({
      id: Date.now(),
      type: 'message',
      text: `New message from ${msg.senderName}`,
      time: new Date().toISOString(),
    })
  }
})

// ---- CHAT UPDATED ----
socket.on('chatUpdated', ({ chatId, chat }) => {
  const { chats } = useStore.getState()
  const updated = chats.map((c) => (c.id === chatId ? chat : c))
  useStore.setState({ chats: updated })
})

// ---- NEW AD ----
socket.on('newAd', (ad) => {
  const { ads, addNotification, me } = useStore.getState()
  useStore.setState({ ads: [ad, ...ads] })
  if (ad.by !== me?.id) {
    addNotification({
      id: Date.now(),
      type: 'ad',
      text: `New ad posted: ${ad.title || 'Advertisement'}`,
      time: new Date().toISOString(),
    })
  }
})

// ---- NEW MATRIMONY ----
socket.on('newMatrimony', (mat) => {
  const { matrimony, addNotification, me } = useStore.getState()
  useStore.setState({ matrimony: [mat, ...matrimony] })
  if (mat.by !== me?.id) {
    addNotification({
      id: Date.now(),
      type: 'matrimony',
      text: `New matrimony profile: ${mat.name || 'New profile'}`,
      time: new Date().toISOString(),
    })
  }
})

export default useStore
