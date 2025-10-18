import React, { useEffect, useRef, useState } from 'react'
import useStore from '../store'

export default function Chats() {
  const { loadAll, chats, activeChatId, setActiveChatId, sendMessage, me, ensureJoined } = useStore()
  const [text, setText] = useState('')
  const chatBoxRef = useRef(null)

  useEffect(() => { loadAll() }, [])
  useEffect(() => { if (activeChatId) ensureJoined(activeChatId) }, [activeChatId])

  const current = chats.find((c) => c.id === activeChatId)

  const getOtherUserName = (chat) => {
    if (!chat || !me) return ''
    if (chat.user1 === me.id) return chat.user2Name || 'Unknown'
    if (chat.user2 === me.id) return chat.user1Name || 'Unknown'
    return chat.user1Name || chat.user2Name || 'Unknown'
  }

  const formatTime = (ts) =>
    ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

  useEffect(() => {
    if (chatBoxRef.current)
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
  }, [current?.messages?.length])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, padding: 16 }}>
      {/* LEFT SIDEBAR */}
      <div>
        <h2 style={{ color: '#7A1C10' }}>Chats</h2>
        <div style={{ display: 'grid', gap: 10, maxHeight: '80vh', overflowY: 'auto' }}>
          {chats.length === 0 ? (
            <div className="card" style={{ color: '#7a6a55' }}>No conversations yet</div>
          ) : (
            chats.map((c) => {
              const last = c.messages.at(-1)
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    background: activeChatId === c.id ? '#FFF2CF' : '#fff',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#5a3210' }}>
                    {getOtherUserName(c)}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: '#7a6a55',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {last?.text || 'No messages yet'}
                  </div>
                  {last && (
                    <div style={{ fontSize: 11, color: '#a88', textAlign: 'right' }}>
                      {formatTime(last.timestamp)}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* CHAT PANEL */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
        {!current ? (
          <div style={{ color: '#7a6a55', textAlign: 'center', marginTop: '30%' }}>
            Select a conversation
          </div>
        ) : (
          <>
            <div
              style={{
                fontWeight: 800,
                color: '#7A1C10',
                fontSize: 18,
                borderBottom: '1px solid #eee',
                paddingBottom: 6,
                marginBottom: 8,
              }}
            >
              {getOtherUserName(current)}
            </div>

            {/* CHAT MESSAGES */}
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
              {current.messages.map((m, i) => {
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

            {/* INPUT BOX */}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input
                className="input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && text.trim()) {
                    sendMessage(activeChatId, text)
                    setText('')
                  }
                }}
                style={{ flex: 1, padding: '10px 14px', borderRadius: 12 }}
              />
              <button
                className="btn"
                onClick={() => {
                  if (!text.trim()) return
                  sendMessage(activeChatId, text)
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
          </>
        )}
      </div>
    </div>
  )
}
