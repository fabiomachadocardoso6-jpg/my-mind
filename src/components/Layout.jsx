import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useApp } from '../contexts/AppContext'

const Layout = () => {
  const { focusMode } = useApp()
  const location = useLocation()
  
  const isChatPage = location.pathname === '/conversa'
  const useDarkBackground = isChatPage && focusMode

  // Aplica o gradiente escuro apenas na página de chat com modo foco ativo
  const backgroundClass = useDarkBackground
    ? 'bg-gradient-primary'
    : 'bg-gradient-to-br from-blue-50 to-violet-50'

  return (
    <div className={`min-h-screen flex flex-col ${backgroundClass} transition-colors duration-300`}>
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
