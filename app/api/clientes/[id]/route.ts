import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nome, telefone, email, endereco, observacoes } = body

    if (!nome) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("clientes")
      .update({
        nome,
        telefone: telefone || null,
        email: email || null,
        endereco: endereco || null,
        observacoes: observacoes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Erro ao atualizar cliente:", error)
      return NextResponse.json({ error: "Erro ao atualizar cliente" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase.from("clientes").delete().eq("id", id)

    if (error) {
      console.error("[v0] Erro ao excluir cliente:", error)
      return NextResponse.json({ error: "Erro ao excluir cliente" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
