/**
 * Vocabulário do domínio (GLOSSARY.md) como tipos do backend.
 *
 * Os valores em texto são os mesmos que vão para o banco e para o JSON da API:
 * snake_case para subpapéis, unidades e status. As *chaves* do JSON são camelCase.
 */

export const ROLES = ['jogador', 'staff'] as const;
export type Role = (typeof ROLES)[number];

export const APPROVAL_STATES = ['ativo', 'pendente', 'recusado'] as const;
export type ApprovalState = (typeof APPROVAL_STATES)[number];

export const UNITS = ['ofensiva', 'defesa', 'special_teams'] as const;
export type Unit = (typeof UNITS)[number];

export const ROSTER_STATUSES = [
  'disponivel',
  'indisponivel',
  'lesionado',
  'reformado',
] as const;
export type RosterStatus = (typeof ROSTER_STATUSES)[number];

/**
 * Subpapéis do staff. Head coach, coordenador ofensivo e coordenador defensivo
 * são exclusivos por time; coordenador de special teams é aditivo.
 */
export const STAFF_SUBROLES = [
  'head_coach',
  'coordenador_ofensivo',
  'coordenador_defensivo',
  'coordenador_special_teams',
] as const;
export type StaffSubrole = (typeof STAFF_SUBROLES)[number];

/**
 * Subpapéis que um cadastro pode auto-declarar. Head coach é semeado no seed e
 * concedido por um head coach já aprovado — nunca auto-declarado.
 */
export const SELF_DECLARABLE_STAFF_SUBROLES = [
  'coordenador_ofensivo',
  'coordenador_defensivo',
  'coordenador_special_teams',
] as const;
export type SelfDeclarableStaffSubrole = (typeof SELF_DECLARABLE_STAFF_SUBROLES)[number];

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}

export function isSelfDeclarableStaffSubrole(
  value: unknown,
): value is SelfDeclarableStaffSubrole {
  return (
    typeof value === 'string' &&
    (SELF_DECLARABLE_STAFF_SUBROLES as readonly string[]).includes(value)
  );
}

/** Representação pública de um usuário (nunca inclui justificativa nem segredos). */
export interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  approvalState: ApprovalState;
  /** Subpapéis do staff (vazio para jogador). */
  subRoles: StaffSubrole[];
}

/** Cadastro de staff aguardando aprovação, visível só para head coach. */
export interface PendingStaff {
  id: string;
  email: string;
  name: string | null;
  requestedSubrole: StaffSubrole;
  createdAt: string;
}
