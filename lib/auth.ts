import { createClient } from "@/lib/supabase/server"

export async function verificarAdmin(matricula: string, senha: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("matricula", matricula)
    .eq("senha", senha)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function getAdminLogado(matricula: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("admins").select("*").eq("matricula", matricula).single()

  if (error || !data) {
    return null
  }

  return data
}
