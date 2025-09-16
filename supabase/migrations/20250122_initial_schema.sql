/*
# Criação do Schema Inicial do Chat
Esta migração cria as tabelas básicas para o aplicativo de chat acessível.

## Query Description:
Cria estrutura segura para perfis de usuário e mensagens de chat.
Inclui políticas RLS para privacidade e triggers para criação automática de perfis.
Operação segura - não afeta dados existentes.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- profiles: perfis de usuário com avatar e configurações
- messages: mensagens do chat com timestamps
- Foreign keys: user_id referencia auth.users

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes - usuários só veem seus próprios dados
- Auth Requirements: Requer autenticação para acesso

## Performance Impact:
- Indexes: Adicionados em user_id e created_at
- Triggers: Criação automática de perfil
- Estimated Impact: Mínimo - estrutura otimizada
*/

-- Tabela de perfis (extensão do auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  focus_mode BOOLEAN DEFAULT false,
  density_mode TEXT DEFAULT 'comfortable', -- comfortable, compact
  animations_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver apenas seu próprio perfil" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar apenas seu próprio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para messages
CREATE POLICY "Usuários podem ver apenas suas próprias mensagens" ON messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias mensagens" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias mensagens" ON messages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias mensagens" ON messages
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Índices para performance
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_profiles_email ON profiles(email);
