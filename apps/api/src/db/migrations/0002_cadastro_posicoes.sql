-- Evolução do schema para o cadastro com papel e posições (card 02).
-- O schema base (0001) não conhecia telefone, permissão de admin nem estado de
-- validação de posição; esta migração os adiciona de forma idempotente, sem
-- perder usuários ou posições já existentes.
-- Posições criadas antes desta migração não tinham noção de pendência e são
-- tratadas como `aprovada` por padrão.
ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

ALTER TABLE player_position
  ADD COLUMN IF NOT EXISTS approval_state text NOT NULL DEFAULT 'aprovada';

ALTER TABLE player_position
  DROP CONSTRAINT IF EXISTS player_position_approval_state_check;

ALTER TABLE player_position
  ADD CONSTRAINT player_position_approval_state_check
  CHECK (approval_state IN ('pendente', 'aprovada'));
