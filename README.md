# Ataque Navigators · Livro final (React)

React 18 + TypeScript + Vite. Sem bibliotecas de UI; CSS simples em `src/styles.css`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build -> dist/
npm run preview  # serve o dist/ em http://localhost:4173
```

- Dados: `src/data/playbook.ts` (tipos em `src/data/types.ts`). Dados incompletos ou estimados estão marcados com `// TODO confirmar`.
- Posição: escolhida no topo; guardada em localStorage (`navigators-posicao`) e aceita `?pos=QB` no URL.
- Checklist guardada em localStorage (`navigators-checklist-v1`).
- Cores com contraste ≥ 7:1; alvos de toque ≥ 44px; layout de desktop a partir de 900px.
