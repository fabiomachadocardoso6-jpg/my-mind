import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMessages, addMessage, supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useApp } from '../contexts/AppContext'
import MessageInput from './MessageInput'

const ChatWindow = () => {
  const { user } = useAuth()
  const { animationsEnabled, densityMode, focusMode } = useApp()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  const isCompact = densityMode === 'compact'
  const useDarkTheme = focusMode;

  useEffect(() => {
    if (!user) return;

    loadMessages()
    
    const channel = supabase
      .channel('messages_channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `author_id=eq.${user.id}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    setLoading(true)
    const { data, error } = await getMessages()
    if (data) {
      setMessages(data)
    }
    setLoading(false)
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: animationsEnabled ? 'smooth' : 'auto' })
    }
  }

  const handleSendMessage = async (content) => {
    const { data, error } = await addMessage(content)
    // A subscription já cuida de adicionar a mensagem na UI, evitando duplicatas.
    return { data, error }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${useDarkTheme ? 'border-blue-300' : 'border-blue-400'}`}></div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4"
        style={{ 
          paddingBottom: 'max(6rem, env(safe-area-inset-bottom, 1.5rem) + 4.5rem)'
        }}
      >
        <div className={`max-w-4xl mx-auto py-4 space-y-${isCompact ? '2' : '4'}`}>
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${useDarkTheme ? 'bg-white/10' : 'bg-gradient-to-br from-blue-100 to-violet-100'}`}>
                <span className="text-2xl">💭</span>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${useDarkTheme ? 'text-white/90' : 'text-gray-700'}`}>
                Sua primeira conversa
              </h3>
              <p className={`text-sm max-w-sm mx-auto ${useDarkTheme ? 'text-white/70' : 'text-gray-500'}`}>
                Comece escrevendo uma mensagem para organizar seus pensamentos
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={animationsEnabled ? { opacity: 0, y: -20 } : false}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl shadow-sm transition-all ${
                    useDarkTheme 
                      ? `bg-black/20 backdrop-blur-sm border border-white/10`
                      : `bg-white border-gray-100 hover:shadow-md`
                  } p-${isCompact ? '3' : '4'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs ${useDarkTheme ? 'text-white/60' : 'text-gray-500'}`}>
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                  <p className={`leading-relaxed ${isCompact ? 'text-sm' : 'text-base'} ${useDarkTheme ? 'text-white/90' : 'text-gray-800'}`}>
                    {message.content}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}

export default ChatWindow
