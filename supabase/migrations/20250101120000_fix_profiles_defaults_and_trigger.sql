/*
          # [Reparo] Correção de Valores Padrão e Gatilho da Tabela 'profiles'
          Este script corrige o erro "Database error saving new user" que ocorre durante o cadastro.

          ## Descrição da Query:
          1.  **ALTER TABLE**: Adiciona valores padrão (DEFAULT) para as colunas de configuração (`focus_mode`, `density_mode`, `animations_enabled`) na tabela `profiles`. Isso garante que, mesmo que o gatilho não forneça esses valores, a criação do perfil não falhará.
          2.  **DROP/CREATE FUNCTION & TRIGGER**: Remove a função e o gatilho antigos (se existirem) e os recria de forma mais robusta, garantindo que o perfil de um novo usuário seja criado corretamente.

          Esta operação é segura e não afeta dados de usuários existentes.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true (manualmente)
          
          ## Estrutura Afetada:
          - Tabela: `public.profiles`
          - Função: `public.handle_new_user`
          - Gatilho: `on_auth_user_created` em `auth.users`
          
          ## Implicações de Segurança:
          - RLS Status: Sem alterações. As políticas existentes são mantidas.
          - Auth Requirements: N/A
          
          ## Impacto de Performance:
          - Mínimo. Apenas afeta a criação de novos usuários.
          */

-- 1. Adicionar valores padrão à tabela de perfis para evitar erros de inserção.
ALTER TABLE public.profiles
  ALTER COLUMN focus_mode SET DEFAULT false,
  ALTER COLUMN density_mode SET DEFAULT 'comfortable',
  ALTER COLUMN animations_enabled SET DEFAULT true;

-- 2. Remover o gatilho e a função antigos para garantir uma recriação limpa.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Recriar a função que lida com a criação de um novo perfil.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  RETURN new;
END;
$$;

-- 4. Recriar o gatilho que aciona a função após a criação de um usuário no Supabase Auth.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
