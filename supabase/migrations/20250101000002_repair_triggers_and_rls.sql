-- =================================================================
-- REPARO DO BANCO DE DADOS - ChatFoco
-- Este script NÃO cria tabelas. Ele garante que os gatilhos e
-- as políticas de segurança (RLS) estejam configurados corretamente.
-- É seguro executar este script múltiplas vezes.
-- =================================================================

-- 1. Garante que a função para criar perfil exista e esteja atualizada.
-- Usa CREATE OR REPLACE para criar ou substituir a função de forma segura.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Garante que o gatilho esteja conectado à função.
-- Remove o gatilho antigo se ele existir, para evitar conflitos.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- Cria o gatilho novamente, garantindo que ele use a função correta.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Ativa a Segurança em Nível de Linha (RLS) para as tabelas.
-- Isso protege os dados para que um usuário não possa ver os dados de outro.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. Garante que as políticas de segurança para a tabela 'profiles' estejam corretas.
-- Remove políticas antigas para evitar duplicatas.
DROP POLICY IF EXISTS "Usuários podem ver e atualizar seus próprios perfis." ON public.profiles;
-- Cria a política correta.
CREATE POLICY "Usuários podem ver e atualizar seus próprios perfis."
ON public.profiles FOR ALL
USING (auth.uid() = id);

-- 5. Garante que as políticas de segurança para a tabela 'messages' estejam corretas.
-- Remove políticas antigas para evitar duplicatas.
DROP POLICY IF EXISTS "Usuários podem ver e criar suas próprias mensagens." ON public.messages;
-- Cria a política correta.
CREATE POLICY "Usuários podem ver e criar suas próprias mensagens."
ON public.messages FOR ALL
USING (auth.uid() = author_id);
