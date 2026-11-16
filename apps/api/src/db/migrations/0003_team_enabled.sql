-- Habilitação por time (preparação para multi-time, fase 3).
-- O MVP atende um time por vez: apenas o time habilitado aceita cadastro e
-- serve a sessão; os demais existem no banco mas respondem indisponível no
-- cadastro. Times pré-existentes permanecem habilitados por padrão
-- (migração compatível, sem quebra de dados).
ALTER TABLE team
  ADD COLUMN IF NOT EXISTS enabled boolean NOT NULL DEFAULT true;
