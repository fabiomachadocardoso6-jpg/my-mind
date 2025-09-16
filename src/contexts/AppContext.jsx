import React, { createContext, useContext, useState, useEffect } from 'react'
import { getProfile, updateProfile } from '../lib/supabase'
import { useAuth } from './AuthContext'

const AppContext = createContext({})

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [focusMode, setFocusMode] = useState(false)
  const [densityMode, setDensityMode] = useState('comfortable')
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  useEffect(() => {
    if (user) {
      loadProfile()
    } else {
      // Limpa o perfil se o usuário fizer logout
      setProfile(null)
    }
  }, [user])

  const loadProfile = async () => {
    const { data, error } = await getProfile()
    
    if (error && error.code !== 'PGRST116') { // PGRST116: 0 rows returned
        console.error('Erro ao carregar o perfil do usuário:', error.message)
    }
    
    if (data) {
      setProfile(data)
      setFocusMode(data.focus_mode || false)
      setDensityMode(data.density_mode || 'comfortable')
      setAnimationsEnabled(data.animations_enabled ?? true)
    } else {
      // Se não houver dados, pode ser que o perfil ainda não foi criado pelo trigger.
      // Isso não é um erro fatal.
      console.warn('Aviso: Perfil do usuário não encontrado. O trigger pode não ter sido executado ainda.');
      setProfile(null); // Garante que o estado do perfil seja limpo.
    }
  }

  const updateSettings = async (settings) => {
    const { data, error } = await updateProfile(settings)
    if (!error && data) {
      setProfile(data[0])
      if (settings.focus_mode !== undefined) setFocusMode(settings.focus_mode)
      if (settings.density_mode) setDensityMode(settings.density_mode)
      if (settings.animations_enabled !== undefined) setAnimationsEnabled(settings.animations_enabled)
    }
    return { data, error }
  }

  const value = {
    profile,
    focusMode,
    densityMode,
    animationsEnabled,
    updateSettings,
    refreshProfile: loadProfile
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
