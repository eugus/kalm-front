import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verificarAdmin } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { matricula, senha } = await request.json()

    if (!matricula || !senha) {
      return NextResponse.json({ error: "Matrícula e senha são obrigatórios" }, { status: 400 })
    }

    const admin = await verificarAdmin(matricula, senha)

    if (!admin) {
      return NextResponse.json({ error: "Matrícula ou senha inválidos" }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set("admin_matricula", matricula, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    return NextResponse.json({ success: true, admin })
  } catch (error) {
    console.error("[v0] Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
