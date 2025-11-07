import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("admin_matricula")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro no logout:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
