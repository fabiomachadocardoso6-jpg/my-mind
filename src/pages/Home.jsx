import React from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Brain, Zap, Shield } from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            ChatFoco
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Organize seus pensamentos sem sobrecarga. 
            Desenvolvido especialmente para pessoas com TDAH.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cadastrar"
              className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-violet-600 transition-all font-medium text-lg"
            >
              Começar agora
            </Link>
            <Link
              to="/entrar"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
            >
              Já tenho conta
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Reduz sobrecarga cognitiva
            </h3>
            <p className="text-gray-600">
              Interface limpa e focada, sem distrações desnecessárias
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Modo foco
            </h3>
            <p className="text-gray-600">
              Esconde elementos secundários quando precisar de máxima concentração
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Privacidade total
            </h3>
            <p className="text-gray-600">
              Suas conversas são privadas e seguras, apenas você tem acesso
            </p>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pronto para organizar seus pensamentos?
          </h2>
          <p className="text-gray-600 mb-6">
            Crie sua conta gratuitamente e comece a usar agora mesmo
          </p>
          <Link
            to="/cadastrar"
            className="inline-block bg-gradient-to-r from-blue-500 to-violet-500 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-violet-600 transition-all font-medium"
          >
            Criar conta grátis
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
