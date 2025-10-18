import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import useStore from '../store'

export default function ChatWindow() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const { chats, me, ensureJoined, sendMessage } = useStore()
  const [text, setText] = useState('')
  const chatBoxRef = useRef(null)

  const current = chats.find((c) => c.id === Number(chatId))

  useEffect(() => {
    if (chatId) ensureJoined(chatId)
  }, [chatId])

  useEffect(() => {
    if (chatBoxRef.current)
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
  }, [current?.messages?.length])

  const getOtherUserName = (chat) => {
    if (!chat || !me) return 'Unknown'
    if (chat.user1 === me.id) return chat.user2Name || 'Unknown'
    if (chat.user2 === me.id) return chat.user1Name || 'Unknown'
    return chat.user1Name || chat.user2Name || 'Unknown'
  }

  const formatTime = (ts) =>
    ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', height: '90vh' }}>
      {/* Header with back arrow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid #eee',
          paddingBottom: 8,
          marginBottom: 8,
        }}
      >
        <button
          onClick={() => navigate('/chats')} // ✅ fixed
          style={{
            background: 'none',
            border: 'none',
            color: '#7A1C10',
            fontSize: 22,
            cursor: 'pointer',
          }}
        >
          <FiArrowLeft />
        </button>
        <h3 style={{ color: '#7A1C10', fontWeight: 800, fontSize: 18 }}>
          {getOtherUserName(current)}
        </h3>
      </div>

      {/* Chat messages */}
      <div
        ref={chatBoxRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          background: '#FFF8EC',
          padding: 10,
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {current?.messages?.map((m, i) => {
          const isMe = m.senderId === me?.id
          return (
            <div
              key={i}
              style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                margin: '8px 0',
                maxWidth: '70%',
              }}
            >
              <div style={{ fontSize: 11, color: '#7a6a55', marginBottom: 4 }}>
                {`${m.senderName || 'User'} • ${formatTime(m.timestamp)}`}
              </div>
              <div
                style={{
                  background: isMe ? '#E59A00' : '#fff',
                  color: isMe ? '#fff' : '#4B2E05',
                  borderRadius: 12,
                  padding: '10px 14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                {m.text}
              </div>
            </div>
          )
        })}
      </div>

      {/* Input Box */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && text.trim()) {
              sendMessage(chatId, text)
              setText('')
            }
          }}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 12 }}
        />
        <button
          onClick={() => {
            if (!text.trim()) return
            sendMessage(chatId, text)
            setText('')
          }}
          style={{
            background: '#E59A00',
            color: '#fff',
            borderRadius: 12,
            padding: '10px 20px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
