import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getAdminLogado } from "@/lib/auth"
import { DashboardContent } from "@/components/dashboard-content"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
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

  // Buscar estatísticas
  const { data: atendimentos } = await supabase.from("atendimentos").select("*, clientes(nome)")

  const { count: totalClientes } = await supabase.from("clientes").select("*", { count: "exact", head: true })

  const { count: totalAtendimentos } = await supabase.from("atendimentos").select("*", { count: "exact", head: true })

  const { count: atendimentosPendentes } = await supabase
    .from("atendimentos")
    .select("*", { count: "exact", head: true })
    .eq("status", "pendente")

  const { data: atendimentosRecentes } = await supabase
    .from("atendimentos")
    .select("*, clientes(nome)")
    .order("data_atendimento", { ascending: false })
    .limit(5)

  return (
    <DashboardContent
      admin={admin}
      totalClientes={totalClientes || 0}
      totalAtendimentos={totalAtendimentos || 0}
      atendimentosPendentes={atendimentosPendentes || 0}
      atendimentosRecentes={atendimentosRecentes || []}
    />
  )
}
