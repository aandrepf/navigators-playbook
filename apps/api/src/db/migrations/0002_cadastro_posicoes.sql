-- O schema inicial já contém as colunas desta fatia em instalações novas.
-- Esta migração torna a evolução explícita para bancos criados pela versão
-- anterior, sem perder usuários ou posições existentes.
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
