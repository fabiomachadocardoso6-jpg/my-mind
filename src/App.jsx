import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

// Páginas
import Home from './pages/Home'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/entrar" element={<LoginForm />} />
            <Route path="/cadastrar" element={<RegisterForm />} />
            
            {/* Rotas protegidas com o novo Layout */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/conversa" element={<Chat />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/configuracoes" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
