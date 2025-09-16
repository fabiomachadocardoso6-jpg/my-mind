import React from 'react'
import { useApp } from '../contexts/AppContext'
import { useLocation } from 'react-router-dom'

const Footer = () => {
  const { densityMode, focusMode } = useApp()
  const location = useLocation()
  const isCompact = densityMode === 'compact'

  const isChatPage = location.pathname === '/conversa'
  const useDarkTheme = isChatPage && focusMode

  const footerClasses = useDarkTheme
    ? `bg-transparent ${isCompact ? 'py-2' : 'py-3'}`
    : `bg-white/80 backdrop-blur-sm border-t border-gray-200 ${isCompact ? 'py-3' : 'py-4'}`
  
  const textClasses = useDarkTheme
    ? 'text-white/60'
    : 'text-gray-600'

  return (
    <footer className={`transition-colors duration-300 ${footerClasses}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          <p className={`${isCompact ? 'text-xs' : 'text-sm'} ${textClasses}`}>
            © 2025 ChatFoco - Desenvolvido para pessoas com TDAH
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
