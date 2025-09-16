import React, { useState } from 'react'
import { Camera, User, Mail, Calendar } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useApp } from '../contexts/AppContext'

const ProfileCard = () => {
  const { user } = useAuth()
  const { profile, densityMode } = useApp()
  const [uploading, setUploading] = useState(false)

  const isCompact = densityMode === 'compact'

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long'
    })
  }

  const handleAvatarUpload = async (event) => {
    // Implementação futura para upload de avatar
    console.log('Upload de avatar será implementado')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header com gradiente */}
        <div className="h-24 bg-gradient-to-r from-blue-500 to-violet-500 relative">
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <div className={`bg-white rounded-full p-1 shadow-lg ${isCompact ? 'w-20 h-20' : 'w-24 h-24'}`}>
                <div className={`bg-gradient-to-br from-blue-100 to-violet-100 rounded-full flex items-center justify-center ${isCompact ? 'w-18 h-18' : 'w-22 h-22'}`}>
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className={`text-gray-600 ${isCompact ? 'w-8 h-8' : 'w-10 h-10'}`} />
                  )}
                </div>
              </div>
              <button
                onClick={() => document.getElementById('avatar-upload').click()}
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors shadow-lg"
                disabled={uploading}
              >
                <Camera className="w-3 h-3" />
              </button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Conteúdo do perfil */}
        <div className={`pt-${isCompact ? '14' : '16'} p-6`}>
          <div className="space-y-4">
            <div>
              <h1 className={`font-bold text-gray-800 ${isCompact ? 'text-lg' : 'text-xl'}`}>
                {profile?.full_name || 'Usuário'}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <Mail className="w-4 h-4" />
                <span className={isCompact ? 'text-sm' : 'text-base'}>{user?.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Membro desde</span>
                </div>
                <p className={`text-gray-800 ${isCompact ? 'text-sm' : 'text-base'}`}>
                  {formatJoinDate(user?.created_at)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">Modo atual</div>
                <p className={`text-gray-800 ${isCompact ? 'text-sm' : 'text-base'}`}>
                  {profile?.focus_mode ? 'Foco ativo' : 'Completo'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">Densidade</div>
                <p className={`text-gray-800 ${isCompact ? 'text-sm' : 'text-base'}`}>
                  {densityMode === 'compact' ? 'Compacta' : 'Confortável'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
