# Matriz Figma → Componente React

Mapeamento entre o inventário Figma (`docs/design/FIGMA-COMPONENT-INVENTORY.md`) e a biblioteca React em `apps/web/src/components/ui/`.

| Origem Figma (Page / Node ID) | Nome no Figma | Componente React | Caminho | `data-slot` | Observações |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `2814:11933` / Set `9892:5454` | `Button` (308 variantes) | `Button` | `primitives/button.tsx` | `button` | `min-height: 44px`; variantes `default`, `primary`, `secondary`, `outline`, `ghost`, `link`, `destructive`, `success`; estados `disabled` e `loading` (`aria-busy`). |
| `9713:3107` / Set `9892:4091` | `Badge` (20 variantes) | `Badge` | `primitives/badge.tsx` | `badge` | Variantes shadcn + domínio: `offense`, `defense`, `st`, `new`, `available`, `unavailable`, `injured`, `retired`, `position`. |
| `2819:27270` / Set `9892:11430` | `Input` (21 variantes) | `Input` | `primitives/input.tsx` | `input` | `min-height: 44px`, `font-size: 16px`, estados `error` e `disabled`. |
| Base Kit | `Select` / `Combobox` | `Select` | `primitives/select.tsx` | `select` | Wrapper nativo acessível, `min-height: 44px`, suporte a `options`/`placeholder`/`error`. |
| Registry `image-zoom` + modal | `ImageZoom` + `Dialog` | `Dialog` | `primitives/dialog.tsx` | `dialog` | `<dialog>` nativo com `showModal`/`close`, backdrop click, Escape, `aria-labelledby`/`aria-describedby`. |
| `9880:18319` / Set `9892:3711` | `Avatar` (9 variantes) | `Avatar` | `primitives/avatar.tsx` | `avatar`, `avatar-fallback` | Fallback de iniciais, imagem, tamanhos `sm`/`default`/`lg`, indicador de status. |
| `9892:14579` / Set `9892:14300` | `Section Heading` (9 variantes) | `SectionHeading` | `primitives/section-heading.tsx` | `section-heading`, `section-heading-tagline`, `section-heading-title`, `section-heading-body`, `section-heading-actions` | Justificação `left`/`center`/`space-between`, tamanhos `large`/`small`. |
| `9880:2019` / Set `9883:5748` | `Banner 10` | `Banner` | `primitives/banner.tsx` | `banner` | Variantes `default`/`highlight`/`warning`, título, descrição, ação de dispensar. |
| `2819:20398` / Sets `9892:10458`, `10376`, `10403` | `Card` + `CardHeader` + `CardFooter` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | `composed/card.tsx` | `card`, `card-header`, `card-title`, `card-description`, `card-content`, `card-footer` | Variantes `default`/`highlight`/`warning`/`danger`, tamanhos `default`/`sm`. |
| `9880:5406` (`Contact 11`) + tokens `component/field/*` | `Field` + `FieldLabel` + `FieldDescription` + `FieldError` | `Field`, `FieldLabel`, `FieldHint`, `FieldError` | `composed/field.tsx` | `field`, `field-label`, `field-hint`, `field-error` | Wrapper acessível com estados `invalid` e `disabled`; erro com `role="alert"`. |
| `10317:66519` / Comp `10292:63620` | `Spinner` | `Spinner` | `primitives/spinner.tsx` | `spinner` | Usado no estado `loading` do Button e como componente standalone. |

## Legendas

- **P0**: Primitivos obrigatórios do MVP.
- **Composed**: Componentes multi-slot construídos a partir dos primitivos e tokens.
