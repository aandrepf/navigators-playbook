# Biblioteca de Componentes UI — SnapIn

Biblioteca interna reutilizável em `apps/web/src/components/ui/`. Sem dependências externas obrigatórias; usa apenas React, tokens do design system e marcações `data-slot`/`data-variant`.

## Estrutura

```
components/ui/
├── index.ts              # Exportações públicas
├── primitives/           # Controles atômicos (P0)
│   ├── button.tsx
│   ├── badge.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── dialog.tsx
│   ├── avatar.tsx
│   ├── section-heading.tsx
│   ├── banner.tsx
│   └── spinner.tsx
└── composed/             # Componentes multi-slot
    ├── card.tsx
    └── field.tsx
```

## Princípios

- **Tokens como fonte única**: cores, espaçamento, raios e tipografia vêm de `src/index.css`.
- **Mobile-first**: controles interativos têm `min-height: 44px`.
- **Acessibilidade**: estados expostos via `aria-*`, foco visível, roles apropriadas.
- **`data-slot`/`data-variant`**: todo componente expõe `data-slot` e, quando aplicável, `data-variant`/`data-size`/`data-state`.

## Uso

```tsx
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  Field,
  FieldLabel,
  Input,
  SectionHeading,
} from './index'
```

## Estados críticos testados

- Button: `disabled`, `loading` (`aria-busy`), cliques.
- Badge: todas as variantes do shadcn + variantes de domínio.
- Input/Select: `error` (`aria-invalid`, `data-state="error"`) e `disabled`.
- Dialog: abertura/fechamento, `aria-labelledby`/`aria-describedby`.
- Avatar: fallback de iniciais, imagem, tamanhos, badge.
- Card/Field: todos os sub-slots e atributos.

## Matriz Figma → React

Veja `FIGMA-REACT-MATRIX.md`.
