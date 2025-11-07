"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [matricula, setMatricula] = useState("")
  const [senha, setSenha] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, senha }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erro ao fazer login")
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError("Erro ao conectar com o servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D9CAB0] to-[#BF8D30] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-[#BF8D30]">Sistema KALM</CardTitle>
          <CardDescription className="text-center">Área administrativa - Faça login para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                type="text"
                placeholder="0001"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                required
                className="focus:ring-[#BF8D30] focus:border-[#BF8D30]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="focus:ring-[#BF8D30] focus:border-[#BF8D30]"
              />
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <Button type="submit" className="w-full bg-[#BF8D30] hover:bg-[#BF712C]" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
