import React, { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

const MessageInput = ({ onSendMessage }) => {
  const { densityMode, focusMode } = useApp()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const textareaRef = useRef(null)

  const isCompact = densityMode === 'compact'
  const useDarkTheme = focusMode;

  useEffect(() => {
    adjustTextareaHeight()
  }, [message])

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const maxHeight = isCompact ? 80 : 120 // máximo 3-4 linhas
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!message.trim() || sending) return

    setSending(true)
    
    try {
      await onSendMessage(message.trim())
      setMessage('')
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  
  const containerClasses = useDarkTheme
    ? 'bg-transparent'
    : 'bg-white border-t border-gray-200'

  const textareaClasses = useDarkTheme
    ? 'bg-black/20 border-white/20 text-white placeholder:text-white/50 focus:bg-black/30 focus:border-white/30'
    : 'bg-gray-50 border-gray-200 text-gray-800 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-40 transition-colors duration-300 ${containerClasses}`}
      style={{
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className={`w-full border rounded-xl px-4 resize-none outline-none transition-all ${
                isCompact ? 'py-2 text-sm min-h-[2.5rem]' : 'py-3 text-base min-h-[3rem]'
              } ${textareaClasses}`}
              rows={1}
              disabled={sending}
            />
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className={`bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:from-blue-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center ${
              isCompact ? 'w-10 h-10' : 'w-12 h-12'
            }`}
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className={isCompact ? 'w-4 h-4' : 'w-5 h-5'} />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default MessageInput
