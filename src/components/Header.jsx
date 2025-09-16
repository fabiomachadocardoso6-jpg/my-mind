import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Settings, MessageCircle, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useApp } from '../contexts/AppContext'
import { signOut } from '../lib/supabase'

const Header = () => {
  const { user } = useAuth()
  const { focusMode, densityMode } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (!user) return null

  const isCompact = densityMode === 'compact'
  const isChatPage = location.pathname === '/conversa'
  const useDarkTheme = isChatPage && focusMode

  const headerHeight = isCompact ? 'h-12' : 'h-16'
  const iconSize = isCompact ? 'w-4 h-4' : 'w-5 h-5'

  const headerClasses = useDarkTheme
    ? 'bg-transparent border-b border-white/20'
    : 'bg-white/80 backdrop-blur-sm border-b border-gray-200'
  
  const logoLinkClasses = useDarkTheme
    ? 'text-white/90 hover:text-white'
    : 'text-gray-800 hover:text-blue-600'

  const getNavLinkClasses = (path) => {
    const isActive = location.pathname === path
    if (useDarkTheme) {
      return `p-2 rounded-lg transition-colors ${
        isActive ? 'text-white bg-white/10' : 'text-blue-100 hover:bg-white/10'
      }`
    }
    return `p-2 rounded-lg transition-colors ${
      isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
    }`
  }
  
  const signOutClasses = useDarkTheme
    ? 'p-2 rounded-lg text-blue-100 hover:bg-white/10 transition-colors'
    : 'p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors'

  return (
    <header className={`${headerHeight} ${headerClasses} sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between">
        <Link 
          to="/conversa" 
          className={`flex items-center gap-2 transition-colors ${logoLinkClasses}`}
        >
          <MessageCircle className={iconSize} />
          <span className={`font-semibold ${isCompact ? 'text-sm' : 'text-base'}`}>
            ChatFoco
          </span>
        </Link>

        {!focusMode && (
          <nav className="flex items-center gap-1">
            <Link to="/conversa" className={getNavLinkClasses('/conversa')} title="Conversa">
              <MessageCircle className={iconSize} />
            </Link>
            <Link to="/perfil" className={getNavLinkClasses('/perfil')} title="Perfil">
              <User className={iconSize} />
            </Link>
            <Link to="/configuracoes" className={getNavLinkClasses('/configuracoes')} title="Configurações">
              <Settings className={iconSize} />
            </Link>
            <button onClick={handleSignOut} className={signOutClasses} title="Sair">
              <LogOut className={iconSize} />
            </button>
          </nav>
        )}

        {focusMode && (
          <button onClick={handleSignOut} className={signOutClasses} title="Sair">
            <LogOut className={iconSize} />
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
