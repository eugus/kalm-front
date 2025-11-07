import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getAdminLogado } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { AtendimentosContent } from "@/components/atendimentos-content"

export default async function AtendimentosPage() {
  const cookieStore = await cookies()
  const adminMatricula = cookieStore.get("admin_matricula")?.value

  if (!adminMatricula) {
    redirect("/login")
  }

  const admin = await getAdminLogado(adminMatricula)

  if (!admin) {
    redirect("/login")
  }

  const supabase = await createClient()

  const { data: atendimentos, error } = await supabase
    .from("atendimentos")
    .select("*, clientes(id, nome)")
    .order("data_atendimento", { ascending: false })

  const { data: clientes } = await supabase.from("clientes").select("id, nome").order("nome", { ascending: true })

  if (error) {
    console.error("[v0] Erro ao buscar atendimentos:", error)
  }

  return <AtendimentosContent atendimentos={atendimentos || []} clientes={clientes || []} />
}
