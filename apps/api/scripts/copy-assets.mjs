// Copia os arquivos de migração (.sql) para dist/, pois o `tsc` não os emite.
import { cpSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, 'src', 'db', 'migrations');
const dest = path.join(root, 'dist', 'db', 'migrations');

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log(`[copy-assets] ${src} -> ${dest}`);
