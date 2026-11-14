import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';

/** Diagrama original (PDF Playmaker X “CRUSADERS”, 6 nov 2026, sha256 4639f22c…) recortado sem alterações. */
export function diagramSrc(n: number) {
  return `diagramas/jogada-${String(n).padStart(2, '0')}.webp`;
}

interface Props { n: number; call: string }

/** Miniatura clicável + janela ampliada acessível (Escape, fechar, fundo, foco preso e devolvido). */
export function PlayDiagram({ n, call }: Props) {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const src = diagramSrc(n);
  const title = `Jogada ${n} · ${call}`;
  const alt = `Diagrama original da jogada ${n}: ${call}`;
  const titleId = `diagrama-titulo-${n}`;

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) { d.showModal(); closeRef.current?.focus(); }
    if (!open && d.open) d.close();
  }, [open]);

  const close = () => { setOpen(false); setFull(false); triggerRef.current?.focus(); };

  // Foco preso dentro da janela.
  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab') return;
    const f = Array.from(dialogRef.current!.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'));
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  const onBackdrop = (e: MouseEvent<HTMLDialogElement>) => { if (e.target === dialogRef.current) close(); };

  return (
    <figure className="diagram">
      <button ref={triggerRef} type="button" className="diagram__thumb" onClick={() => setOpen(true)}
        aria-haspopup="dialog" aria-label={`Ampliar diagrama da jogada ${n}`}>
        <img src={src} alt={alt} loading="lazy" decoding="async" width={1634} height={1148} />
        <span className="diagram__hint" aria-hidden="true">Toque para ampliar</span>
      </button>
      <figcaption className="small">Diagrama original do livro de 6 nov (jogada {n}).</figcaption>

      <dialog ref={dialogRef} className="lightbox" aria-labelledby={titleId}
        onCancel={(e) => { e.preventDefault(); close(); }} onKeyDown={onKeyDown} onClick={onBackdrop}>
        {open && (
          <div className="lightbox__panel">
            <div className="lightbox__bar">
              <h2 id={titleId} className="lightbox__title">{title}</h2>
              <button ref={closeRef} type="button" className="btn-dark" onClick={close}>Fechar</button>
            </div>
            <div className={`lightbox__scroll${full ? ' is-full' : ''}`} tabIndex={0} aria-label="Diagrama (pode fazer zoom com dois dedos)">
              <img src={src} alt={alt} width={1634} height={1148} />
            </div>
            <div className="lightbox__actions">
              <button type="button" className="btn-light" aria-pressed={full} onClick={() => setFull((x) => !x)}>
                {full ? 'Ajustar ao ecrã' : 'Ver tamanho real'}
              </button>
              <a className="btn-light" href={src} target="_blank" rel="noopener">Abrir imagem</a>
            </div>
          </div>
        )}
      </dialog>
    </figure>
  );
}
