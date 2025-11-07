import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, telefone, email, endereco, observacoes } = body

    if (!nome) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("clientes")
      .insert({
        nome,
        telefone: telefone || null,
        email: email || null,
        endereco: endereco || null,
        observacoes: observacoes || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Erro ao criar cliente:", error)
      return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
