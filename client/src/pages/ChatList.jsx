import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store'

export default function ChatList() {
  const { loadAll, chats, setActiveChatId, me } = useStore()
  const navigate = useNavigate()

  useEffect(() => { loadAll() }, [])

  const getOtherUserName = (chat) => {
    if (!chat || !me) return 'Unknown'
    if (chat.user1 === me.id) return chat.user2Name || 'Unknown'
    if (chat.user2 === me.id) return chat.user1Name || 'Unknown'
    return chat.user1Name || chat.user2Name || 'Unknown'
  }

  const formatTime = (ts) =>
    ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

  const openChat = (chat) => {
    setActiveChatId(chat.id)
    navigate(`/chats/${chat.id}`) // ✅ fixed route
  }

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ color: '#7A1C10' }}>Chats</h2>
      <div style={{ display: 'grid', gap: 10 }}>
        {chats.length === 0 ? (
          <div className="card" style={{ color: '#7a6a55' }}>No conversations yet</div>
        ) : (
          chats.map((c) => {
            const last = c.messages.at(-1)
            return (
              <div
                key={c.id}
                className="card"
                onClick={() => openChat(c)}
                style={{
                  cursor: 'pointer',
                  background: '#FFF8E1',
                  borderRadius: 12,
                  padding: '10px 12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontWeight: 700, color: '#5A3210' }}>{getOtherUserName(c)}</div>
                <div style={{
                  color: '#7a6a55',
                  fontSize: 14,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
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
  )
}
