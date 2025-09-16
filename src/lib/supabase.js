import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funções utilitárias para auth
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Funções para mensagens
export const getMessages = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })
  
  return { data, error }
}

export const addMessage = async (content) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Usuário não autenticado') };

  // Corrigido: Captura o erro potencial de getProfile
  const { data: profile, error: profileError } = await getProfile();

  // Mesmo que haja um erro (ex: perfil ainda não criado), podemos continuar.
  // O nome do autor usará o email como fallback.
  if (profileError) {
    console.warn('Aviso: Não foi possível carregar o perfil ao enviar a mensagem. Usando email como fallback.', profileError.message);
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([{ 
      content, 
      author_id: user.id,
      author_name: profile?.full_name || user.email // O fallback já existe e é bom.
    }])
    .select()
  
  return { data, error }
}

// Funções para perfil
export const getProfile = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single()
  
  return { data, error }
}

export const updateProfile = async (updates) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Usuário não autenticado') };

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
  
  return { data, error }
}
