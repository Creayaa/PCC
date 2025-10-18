# 🕉️ Padmashali Community Center — Full Stack Web Platform with Real-Time Chat

Padmashali Community Center is a modern full-stack web application built to connect the Padmashali community through verified member profiles, matrimony listings, ads, and real-time chat — all in a simple, mobile-friendly interface.

This project demonstrates **complete end-to-end integration** of React, Node.js, and Socket.IO with a local JSON database, enabling real-time conversations and live data updates with zero external dependencies.

---

## 🌟 Key Features

- ⚡ **Instant Real-Time Chat** using WebSockets (Socket.IO)
- 🧑‍🤝‍🧑 **Contacts Integration** — start chats directly from user list
- 💍 **Matrimony & Ads Sections** — discover and connect with others
- 💬 **Auto-Chat Creation** on interest in ads/matrimony
- 🗂️ **Unified Responsive UI** — modern design in `src/styles/App.css`
- 🔄 **Persistent Login Sessions** — saved across reloads via localStorage
- 🔔 **Real-Time Notifications** for new messages, ads, and matrimony posts
- 🧩 **Simple JSON Database (LowDB)** — no external setup needed

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React 18 (Vite) + Zustand for state management |
| **Backend** | Node.js + Express.js + Socket.IO |
| **Database** | LowDB (JSON-based local file storage) |
| **Styling** | CSS (unified in `App.css`) |
| **WebSocket** | Socket.IO (bi-directional event-based communication) |

---

## 📁 Project Structure

```

padmashali_community_center/
│
├── client/                 # Frontend app
│   ├── src/
│   │   ├── pages/          # Login, Register, Home, ChatList, ChatWindow, Matrimony, Ads
│   │   ├── components/     # Layout, Header, Sidebar.
│   │   ├── store.js        # Zustand store with socket + API integration
│   │   └── styles/App.css  # Unified styling
│   └── vite.config.js
│
├── server/
│   ├── index.js            # Express backend + Socket.IO server
│   ├── data/
│   │   └── db.json         # Local LowDB database (auto-created)
│   └── package.json
│
└── README.md

````

---

## ⚙️ Prerequisites

- Node.js v18+
- npm (or yarn/pnpm)
- Browser: Chrome / Edge / Firefox (latest)

---

## 🚀 Setup and Run Locally

### 1️⃣ Start the Server

```bash
cd server
npm install
npm start
````

> Server runs at: **[http://localhost:4000](http://localhost:4000)**

---

### 2️⃣ Start the Client

```bash
cd client
npm install
npm run dev
```

> Client runs at: **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Demo Login

* Enter **any phone number**
* On OTP screen, use **123456**
* If new → redirected to **Registration**
* After login → Home → Chats, Ads, Matrimony, Contacts available

---

## 💾 Database Info

All data is stored locally in:

```
server/data/db.json
```

You can safely delete or edit this file anytime to reset data.
It automatically re-initializes if missing.

---

## 🧩 Debugging Tips

### 1️⃣ **Check WebSocket Connection**

If chats are not updating live:

* Ensure both server (`localhost:4000`) and client (`localhost:5173`) are running
* Open browser console → check `"🟢 Client connected"` in Node logs

### 2️⃣ **Reset DB**

If data becomes inconsistent:

```bash
rm server/data/db.json
```

Restart the server — a new empty file will be created.

### 3️⃣ **Check Socket Events**

Messages flow via events:

* `join` → join chat room
* `sendMessage` → send chat message
* `message` → receive new message
* `chatUpdated` → broadcast latest chat state

Use `console.log` in `store.js` or `index.js` to verify.

### 4️⃣ **Refresh Session**

If logged out unexpectedly:

* Clear browser localStorage → reload app

---

## 🌐 Deployment Guide

### 🧱 1️⃣ Backend (Server)

**Option A: Node on VPS / Local**

```bash
cd server
npm install
node index.js
```

**Option B: Deploy to Render / Railway / Heroku**

* Set `PORT=4000`
* Use persistent storage (e.g., mount volume for `data/db.json`)

---

### 💻 2️⃣ Frontend (Client)

**Production Build**

```bash
cd client
npm run build
```

**Deploy Options:**

* Host static files via Nginx / Apache
* Or deploy to:

  * **Netlify**
  * **Vercel**
  * **Render (Static Site)**
  * **GitHub Pages**

Ensure `VITE_API_URL` (if used) points to your live backend.

---

## 🔐 Environment Variables (optional)

| Variable       | Description               | Default                 |
| -------------- | ------------------------- | ----------------------- |
| `PORT`         | Backend server port       | `4000`                  |
| `VITE_API_URL` | API endpoint for frontend | `http://localhost:4000` |

---

## 🧰 Developer Workflow

* Use **Zustand** for all global state management (`store.js`)
* Backend API: Express routes under `/auth`, `/users`, `/ads`, `/matrimony`, `/chats`
* WebSocket: Automatically reconnects after login and joins all user chats

---

## 🧑‍💻 For Developers

### Useful Commands

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Run frontend in development mode   |
| `npm start`     | Run backend server                 |
| `npm run build` | Create production build (frontend) |

---

## 💡 Future Enhancements

* ✅ Move LowDB → MongoDB or Firebase
* ✅ Add Image/Video uploads for Matrimony & Ads
* ✅ Group chat and community event rooms
* ✅ Push notifications (mobile/web)
* ✅ Deployed version on Render or Vercel

---

## 🧾 License

MIT License © 2025 — Padmashali Community Center (Creayaa Private Limited)

---

## 👤 Author

**Chaitanya Sangem**
Staff Software Engineer • Full Stack & Cloud Architect
🌐 [creayaa.com](https://creayaa.com) | 💼 [LinkedIn](https://linkedin.com/in/csangem)

```
