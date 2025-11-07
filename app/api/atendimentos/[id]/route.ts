import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { cliente_id, data_atendimento, tipo, descricao, status, valor } = body

    if (!cliente_id || !data_atendimento || !tipo || !status) {
      return NextResponse.json({ error: "Cliente, data, tipo e status são obrigatórios" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("atendimentos")
      .update({
        cliente_id,
        data_atendimento,
        tipo,
        descricao: descricao || null,
        status,
        valor: valor || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Erro ao atualizar atendimento:", error)
      return NextResponse.json({ error: "Erro ao atualizar atendimento" }, { status: 500 })
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

    const { error } = await supabase.from("atendimentos").delete().eq("id", id)

    if (error) {
      console.error("[v0] Erro ao excluir atendimento:", error)
      return NextResponse.json({ error: "Erro ao excluir atendimento" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
