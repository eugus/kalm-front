"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Clock, LogOut } from "lucide-react"
import Link from "next/link"

interface DashboardContentProps {
  admin: { nome: string; matricula: string }
  totalClientes: number
  totalAtendimentos: number
  atendimentosPendentes: number
  atendimentosRecentes: any[]
}

export function DashboardContent({
  admin,
  totalClientes,
  totalAtendimentos,
  atendimentosPendentes,
  atendimentosRecentes,
}: DashboardContentProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D9CAB0] to-[#BF8D30]">
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#BF8D30]">Sistema KALM</h1>
              <p className="text-sm text-muted-foreground">Bem-vindo, {admin.nome}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 border-[#BF8D30] text-[#BF8D30] hover:bg-[#BF8D30] hover:text-white bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-l-4 border-l-[#BF8D30]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="w-4 h-4 text-[#BF8D30]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#BF8D30]">{totalClientes}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#BF712C]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Atendimentos</CardTitle>
              <Calendar className="w-4 h-4 text-[#BF712C]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#BF712C]">{totalAtendimentos}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos Pendentes</CardTitle>
              <Clock className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{atendimentosPendentes}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Clientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/clientes">
                <Button className="w-full bg-[#BF8D30] hover:bg-[#BF712C]">Ver Todos os Clientes</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Atendimentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/atendimentos">
                <Button className="w-full bg-[#BF8D30] hover:bg-[#BF712C]">Ver Todos os Atendimentos</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Atendimentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {atendimentosRecentes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Nenhum atendimento cadastrado ainda</p>
            ) : (
              <div className="space-y-4">
                {atendimentosRecentes.map((atendimento) => (
                  <div
                    key={atendimento.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{atendimento.clientes?.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {atendimento.tipo} - {new Date(atendimento.data_atendimento).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        atendimento.status === "concluido"
                          ? "bg-green-100 text-green-800"
                          : atendimento.status === "pendente"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {atendimento.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
