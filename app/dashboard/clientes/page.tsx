import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getAdminLogado } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { ClientesContent } from "@/components/clientes-content"

export default async function ClientesPage() {
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

  const { data: clientes, error } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Erro ao buscar clientes:", error)
  }

  return <ClientesContent clientes={clientes || []} />
}
