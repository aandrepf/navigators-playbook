CREATE TABLE team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- "user" é palavra reservada no Postgres; sempre referenciar entre aspas.
CREATE TABLE "user" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES team(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  role text NOT NULL CHECK (role IN ('jogador', 'staff')),
  approval_state text NOT NULL CHECK (approval_state IN ('ativo', 'pendente', 'recusado')),
  email_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_email_unique_per_team UNIQUE (team_id, email)
);

CREATE INDEX user_email_idx ON "user" (email);

CREATE TABLE player (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES team(id) ON DELETE CASCADE,
  user_id uuid NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
  roster_status text NOT NULL DEFAULT 'disponivel'
    CHECK (roster_status IN ('disponivel', 'indisponivel', 'lesionado', 'reformado')),
  note text,
  expected_return_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE player_position (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES team(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES player(id) ON DELETE CASCADE,
  unit text NOT NULL CHECK (unit IN ('ofensiva', 'defesa', 'special_teams')),
  position text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT player_position_unique UNIQUE (player_id, unit, position)
);

CREATE TABLE staff_role (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES team(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (
    role IN ('head_coach', 'coordenador_ofensivo', 'coordenador_defensivo', 'coordenador_special_teams')
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT staff_role_unique_per_user UNIQUE (user_id, role)
);

-- head coach e coordenadores de unidade são exclusivos por time;
-- coordenador de special teams é aditivo e acumulável.
CREATE UNIQUE INDEX staff_role_exclusive_per_team ON staff_role (team_id, role)
  WHERE role <> 'coordenador_special_teams';

CREATE TABLE session (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES team(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

CREATE INDEX session_user_idx ON session (user_id);

CREATE TABLE email_code (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES team(id) ON DELETE CASCADE,
  email text NOT NULL,
  code_hash text NOT NULL,
  salt text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz
);

CREATE INDEX email_code_lookup_idx ON email_code (team_id, email, created_at DESC);
