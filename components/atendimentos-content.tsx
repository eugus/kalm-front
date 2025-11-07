"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, ArrowLeft, Calendar, Download } from "lucide-react"
import Link from "next/link"

interface Cliente {
  id: string
  nome: string
}

interface Atendimento {
  id: string
  cliente_id: string
  data_atendimento: string
  tipo: string
  descricao: string | null
  status: string
  valor: number | null
  clientes: { id: string; nome: string } | null
}

interface AtendimentosContentProps {
  atendimentos: Atendimento[]
  clientes: Cliente[]
}

export function AtendimentosContent({ atendimentos: initialAtendimentos, clientes }: AtendimentosContentProps) {
  const router = useRouter()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingAtendimento, setEditingAtendimento] = useState<Atendimento | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    cliente_id: "",
    data_atendimento: "",
    tipo: "",
    descricao: "",
    status: "pendente",
    valor: "",
  })

  const resetForm = () => {
    setFormData({
      cliente_id: "",
      data_atendimento: "",
      tipo: "",
      descricao: "",
      status: "pendente",
      valor: "",
    })
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/atendimentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          valor: formData.valor ? Number.parseFloat(formData.valor) : null,
        }),
      })

      if (response.ok) {
        setIsAddOpen(false)
        resetForm()
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Erro ao adicionar atendimento:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAtendimento) return

    setLoading(true)

    try {
      const response = await fetch(`/api/atendimentos/${editingAtendimento.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          valor: formData.valor ? Number.parseFloat(formData.valor) : null,
        }),
      })

      if (response.ok) {
        setIsEditOpen(false)
        setEditingAtendimento(null)
        resetForm()
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Erro ao editar atendimento:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setLoading(true)

    try {
      const response = await fetch(`/api/atendimentos/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDeleteId(null)
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Erro ao excluir atendimento:", error)
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (atendimento: Atendimento) => {
    setEditingAtendimento(atendimento)
    setFormData({
      cliente_id: atendimento.cliente_id,
      data_atendimento: new Date(atendimento.data_atendimento).toISOString().slice(0, 16),
      tipo: atendimento.tipo,
      descricao: atendimento.descricao || "",
      status: atendimento.status,
      valor: atendimento.valor?.toString() || "",
    })
    setIsEditOpen(true)
  }

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import("jspdf")
    const autoTable = (await import("jspdf-autotable")).default

    const doc = new jsPDF()

    // Título do relatório
    doc.setFontSize(18)
    doc.setTextColor(191, 141, 48) // Cor #BF8D30
    doc.text("Relatório de Atendimentos", 14, 20)

    // Data de geração
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(
      `Gerado em: ${new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      14,
      28,
    )

    // Preparar dados para a tabela
    const tableData = initialAtendimentos.map((atendimento) => [
      atendimento.clientes?.nome || "N/A",
      new Date(atendimento.data_atendimento).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      atendimento.tipo,
      atendimento.status === "em_andamento"
        ? "Em Andamento"
        : atendimento.status.charAt(0).toUpperCase() + atendimento.status.slice(1),
      atendimento.valor ? `R$ ${atendimento.valor.toFixed(2)}` : "N/A",
    ])

    autoTable(doc, {
      head: [["Cliente", "Data/Hora", "Tipo", "Status", "Valor"]],
      body: tableData,
      startY: 35,
      theme: "grid",
      headStyles: {
        fillColor: [191, 141, 48], // Cor #BF8D30
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 35 },
        2: { cellWidth: 30 },
        3: { cellWidth: 35 },
        4: { cellWidth: 25 },
      },
    })

    // Adicionar resumo no final
    const finalY = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(12)
    doc.setTextColor(191, 141, 48)
    doc.text("Resumo", 14, finalY)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text(`Total de atendimentos: ${initialAtendimentos.length}`, 14, finalY + 8)

    const totalValor = initialAtendimentos.reduce((sum, at) => sum + (at.valor || 0), 0)
    doc.text(`Valor total: R$ ${totalValor.toFixed(2)}`, 14, finalY + 15)

    const statusCounts = initialAtendimentos.reduce(
      (acc, at) => {
        acc[at.status] = (acc[at.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    let yPos = finalY + 22
    doc.text("Status:", 14, yPos)
    Object.entries(statusCounts).forEach(([status, count]) => {
      yPos += 7
      const statusLabel = status === "em_andamento" ? "Em Andamento" : status.charAt(0).toUpperCase() + status.slice(1)
      doc.text(`  - ${statusLabel}: ${count}`, 14, yPos)
    })

    // Salvar o PDF
    doc.save(`relatorio-atendimentos-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D9CAB0] to-[#BF8D30]">
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="icon" className="border-[#BF8D30] bg-transparent">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-[#BF8D30]">Atendimentos</h1>
            </div>
            <div className="flex gap-2">
              {initialAtendimentos.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  className="gap-2 border-[#BF8D30] text-[#BF8D30] hover:bg-[#BF8D30] hover:text-white bg-transparent"
                >
                  <Download className="w-4 h-4" />
                  Baixar Relatório
                </Button>
              )}
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-[#BF8D30] hover:bg-[#BF712C]">
                    <Plus className="w-4 h-4" />
                    Novo Atendimento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Atendimento</DialogTitle>
                    <DialogDescription>Preencha os dados do novo atendimento</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAdd} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cliente">Cliente *</Label>
                      <Select
                        value={formData.cliente_id}
                        onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientes.map((cliente) => (
                            <SelectItem key={cliente.id} value={cliente.id}>
                              {cliente.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data">Data e Hora *</Label>
                      <Input
                        id="data"
                        type="datetime-local"
                        value={formData.data_atendimento}
                        onChange={(e) => setFormData({ ...formData, data_atendimento: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo *</Label>
                      <Input
                        id="tipo"
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                        placeholder="Ex: Consulta, Retorno, Emergência"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="em_andamento">Em Andamento</SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valor">Valor (R$)</Label>
                      <Input
                        id="valor"
                        type="number"
                        step="0.01"
                        value={formData.valor}
                        onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        rows={3}
                        placeholder="Detalhes do atendimento..."
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAddOpen(false)
                          resetForm()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={loading} className="bg-[#BF8D30] hover:bg-[#BF712C]">
                        {loading ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {initialAtendimentos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum atendimento cadastrado ainda. Clique em "Novo Atendimento" para começar.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {initialAtendimentos.map((atendimento) => (
              <Card key={atendimento.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {atendimento.clientes?.nome || "Cliente não encontrado"}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(atendimento.data_atendimento).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        atendimento.status === "concluido"
                          ? "bg-green-100 text-green-800"
                          : atendimento.status === "pendente"
                            ? "bg-orange-100 text-orange-800"
                            : atendimento.status === "em_andamento"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {atendimento.status === "em_andamento"
                        ? "Em Andamento"
                        : atendimento.status.charAt(0).toUpperCase() + atendimento.status.slice(1)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                      <p className="text-sm">{atendimento.tipo}</p>
                    </div>
                    {atendimento.valor && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Valor</p>
                        <p className="text-sm font-semibold text-[#BF8D30]">R$ {atendimento.valor.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                  {atendimento.descricao && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                      <p className="text-sm">{atendimento.descricao}</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1 bg-transparent"
                      onClick={() => openEditDialog(atendimento)}
                    >
                      <Edit className="w-3 h-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                      onClick={() => setDeleteId(atendimento.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Atendimento</DialogTitle>
              <DialogDescription>Atualize os dados do atendimento</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cliente">Cliente *</Label>
                <Select
                  value={formData.cliente_id}
                  onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-data">Data e Hora *</Label>
                <Input
                  id="edit-data"
                  type="datetime-local"
                  value={formData.data_atendimento}
                  onChange={(e) => setFormData({ ...formData, data_atendimento: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tipo">Tipo *</Label>
                <Input
                  id="edit-tipo"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-valor">Valor (R$)</Label>
                <Input
                  id="edit-valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-descricao">Descrição</Label>
                <Textarea
                  id="edit-descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditOpen(false)
                    setEditingAtendimento(null)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="bg-[#BF8D30] hover:bg-[#BF712C]">
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este atendimento? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
