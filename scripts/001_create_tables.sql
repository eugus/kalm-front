-- Criar tabela de administradores
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricula TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de atendimentos
CREATE TABLE IF NOT EXISTS public.atendimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  data_atendimento TIMESTAMPTZ NOT NULL,
  tipo TEXT NOT NULL,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  valor DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atendimentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para admins (apenas leitura)
CREATE POLICY "Permitir leitura de admins" ON public.admins
  FOR SELECT
  USING (true);

-- Políticas RLS para clientes (total acesso)
CREATE POLICY "Permitir tudo em clientes" ON public.clientes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Políticas RLS para atendimentos (total acesso)
CREATE POLICY "Permitir tudo em atendimentos" ON public.atendimentos
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_atendimentos_cliente_id ON public.atendimentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_atendimentos_data ON public.atendimentos(data_atendimento);
CREATE INDEX IF NOT EXISTS idx_atendimentos_status ON public.atendimentos(status);
