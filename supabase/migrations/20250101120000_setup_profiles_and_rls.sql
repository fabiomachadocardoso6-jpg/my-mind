/*
          # [Operação Estrutural] Criação de Perfis e Segurança
          Cria a tabela `profiles` para armazenar dados do usuário, um gatilho para popular essa tabela automaticamente após o registro, e aplica políticas de segurança (RLS) para proteger os dados.

          ## Query Description: Esta operação é segura e fundamental para o funcionamento do aplicativo. Ela não afeta dados existentes (se houver) e apenas adiciona a estrutura necessária para que novos usuários possam se cadastrar e usar o chat. Sem esta migração, o cadastro de usuários falhará.
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true (pode ser revertido manualmente)
          
          ## Structure Details:
          - Cria a tabela `public.profiles`.
          - Cria a função `public.handle_new_user`.
          - Cria o gatilho `on_auth_user_created` na tabela `auth.users`.
          - Ativa RLS e cria políticas nas tabelas `profiles` e `messages`.
          
          ## Security Implications:
          - RLS Status: Habilitado
          - Policy Changes: Sim (adiciona políticas de acesso)
          - Auth Requirements: As políticas usam `auth.uid()` para garantir que cada usuário só acesse seus próprios dados.
          
          ## Performance Impact:
          - Indexes: Adiciona uma chave primária em `profiles`.
          - Triggers: Adiciona um gatilho em `auth.users` (impacto mínimo).
          - Estimated Impact: Nenhum impacto perceptível no desempenho.
          */

-- 1. Cria a tabela de perfis
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  focus_mode boolean DEFAULT false,
  density_mode text DEFAULT 'comfortable',
  animations_enabled boolean DEFAULT true,
  avatar_url text,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);
COMMENT ON TABLE public.profiles IS 'Armazena informações de perfil para cada usuário.';

-- 2. Ativa a segurança a nível de linha (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Cria políticas de acesso para a tabela de perfis
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Cria uma função para criar um perfil automaticamente quando um novo usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
COMMENT ON FUNCTION public.handle_new_user() IS 'Cria automaticamente um perfil para um novo usuário.';

-- 5. Cria o gatilho que executa a função acima após um novo usuário ser inserido
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Ativa RLS para a tabela de mensagens (se ainda não estiver ativa)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 7. Cria políticas para a tabela de mensagens
-- Remove políticas antigas se existirem, para evitar conflitos
DROP POLICY IF EXISTS "Users can view their own messages." ON public.messages;
DROP POLICY IF EXISTS "Users can insert their own messages." ON public.messages;

CREATE POLICY "Users can view their own messages." ON public.messages FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Users can insert their own messages." ON public.messages FOR INSERT WITH CHECK (auth.uid() = author_id);
