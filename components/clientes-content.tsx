"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Cliente {
  id: string
  nome: string
  telefone: string | null
  email: string | null
  endereco: string | null
  observacoes: string | null
  created_at: string
}

interface ClientesContentProps {
  clientes: Cliente[]
}

export function ClientesContent({ clientes: initialClientes }: ClientesContentProps) {
  const router = useRouter()
  const [clientes, setClientes] = useState(initialClientes)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    endereco: "",
    observacoes: "",
  })

  const resetForm = () => {
    setFormData({
      nome: "",
      telefone: "",
      email: "",
      endereco: "",
      observacoes: "",
    })
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsAddOpen(false)
        resetForm()
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Erro ao adicionar cliente:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCliente) return

    setLoading(true)

    try {
      const response = await fetch(`/api/clientes/${editingCliente.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsEditOpen(false)
        setEditingCliente(null)
        resetForm()
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Erro ao editar cliente:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setLoading(true)

    try {
      const response = await fetch(`/api/clientes/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDeleteId(null)
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Erro ao excluir cliente:", error)
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone || "",
      email: cliente.email || "",
      endereco: cliente.endereco || "",
      observacoes: cliente.observacoes || "",
    })
    setIsEditOpen(true)
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
              <h1 className="text-2xl font-bold text-[#BF8D30]">Clientes</h1>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-[#BF8D30] hover:bg-[#BF712C]">
                  <Plus className="w-4 h-4" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Cliente</DialogTitle>
                  <DialogDescription>Preencha os dados do novo cliente</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      rows={3}
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {clientes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum cliente cadastrado ainda. Clique em "Novo Cliente" para começar.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clientes.map((cliente) => (
              <Card key={cliente.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{cliente.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {cliente.telefone && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Tel:</span> {cliente.telefone}
                    </p>
                  )}
                  {cliente.email && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Email:</span> {cliente.email}
                    </p>
                  )}
                  {cliente.endereco && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">End:</span> {cliente.endereco}
                    </p>
                  )}
                  {cliente.observacoes && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Obs:</span> {cliente.observacoes}
                    </p>
                  )}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1 bg-transparent"
                      onClick={() => openEditDialog(cliente)}
                    >
                      <Edit className="w-3 h-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                      onClick={() => setDeleteId(cliente.id)}
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>Atualize os dados do cliente</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome *</Label>
                <Input
                  id="edit-nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-telefone">Telefone</Label>
                <Input
                  id="edit-telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endereco">Endereço</Label>
                <Input
                  id="edit-endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-observacoes">Observações</Label>
                <Textarea
                  id="edit-observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditOpen(false)
                    setEditingCliente(null)
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
                Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
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
