import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cliente_id, data_atendimento, tipo, descricao, status, valor } = body

    if (!cliente_id || !data_atendimento || !tipo || !status) {
      return NextResponse.json({ error: "Cliente, data, tipo e status são obrigatórios" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("atendimentos")
      .insert({
        cliente_id,
        data_atendimento,
        tipo,
        descricao: descricao || null,
        status,
        valor: valor || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Erro ao criar atendimento:", error)
      return NextResponse.json({ error: "Erro ao criar atendimento" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
