-- Inserir admin inicial com matrícula 0001 e senha "admin123"
-- Nota: Em produção, a senha deve ser hasheada adequadamente
INSERT INTO public.admins (matricula, senha, nome)
VALUES ('0001', 'admin123', 'Administrador')
ON CONFLICT (matricula) DO NOTHING;
