import React, { useState } from 'react'
import { Focus, Palette, Zap, Volume2 } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

const Settings = () => {
  const { profile, focusMode, densityMode, animationsEnabled, updateSettings } = useApp()
  const [saving, setSaving] = useState(false)

  const handleToggleFocusMode = async () => {
    setSaving(true)
    await updateSettings({ focus_mode: !focusMode })
    setSaving(false)
  }

  const handleDensityChange = async (newDensity) => {
    setSaving(true)
    await updateSettings({ density_mode: newDensity })
    setSaving(false)
  }

  const handleAnimationsToggle = async () => {
    setSaving(true)
    await updateSettings({ animations_enabled: !animationsEnabled })
    setSaving(false)
  }

  const isCompact = densityMode === 'compact'

  // O Header foi removido, pois agora é gerenciado pelo Layout.
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className={`font-bold text-gray-800 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
          Configurações
        </h1>
        <p className="text-gray-600 mt-1">
          Personalize sua experiência
        </p>
      </div>

      <div className="space-y-4">
        {/* Modo Foco */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Focus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className={`font-semibold text-gray-800 ${isCompact ? 'text-base' : 'text-lg'}`}>
                  Modo Foco
                </h3>
                <p className={`text-gray-600 mt-1 ${isCompact ? 'text-sm' : 'text-base'}`}>
                  Esconde elementos secundários para máxima concentração
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleFocusMode}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                focusMode ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  focusMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Densidade da Interface */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className={`font-semibold text-gray-800 ${isCompact ? 'text-base' : 'text-lg'}`}>
                Densidade da Interface
              </h3>
              <p className={`text-gray-600 mt-1 ${isCompact ? 'text-sm' : 'text-base'}`}>
                Escolha o espaçamento que funciona melhor para você
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDensityChange('comfortable')}
              disabled={saving}
              className={`p-3 rounded-lg border-2 transition-all ${
                densityMode === 'comfortable'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium">Confortável</div>
              <div className="text-xs text-gray-500 mt-1">Mais espaço</div>
            </button>
            
            <button
              onClick={() => handleDensityChange('compact')}
              disabled={saving}
              className={`p-3 rounded-lg border-2 transition-all ${
                densityMode === 'compact'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium">Compacta</div>
              <div className="text-xs text-gray-500 mt-1">Menos espaço</div>
            </button>
          </div>
        </div>

        {/* Animações */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className={`font-semibold text-gray-800 ${isCompact ? 'text-base' : 'text-lg'}`}>
                  Animações
                </h3>
                <p className={`text-gray-600 mt-1 ${isCompact ? 'text-sm' : 'text-base'}`}>
                  Ative ou desative animações visuais
                </p>
              </div>
            </div>
            <button
              onClick={handleAnimationsToggle}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                animationsEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Informações da Conta */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className={`font-semibold text-gray-800 mb-4 ${isCompact ? 'text-base' : 'text-lg'}`}>
            Sobre sua conta
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{profile?.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Nome:</span>
              <span>{profile?.full_name || 'Não informado'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
