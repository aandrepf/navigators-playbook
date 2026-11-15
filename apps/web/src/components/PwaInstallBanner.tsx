import { useState } from 'react'

const STORAGE_KEY = 'playbook-pwa-banner-dismissed'

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS legacy
    ('standalone' in window.navigator && Boolean(window.navigator.standalone))
  )
}

function readDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function PwaInstallBanner() {
  const [visible, setVisible] = useState(() => !isStandalone() && !readDismissed())

  function dismiss() {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore
    }
  }

  if (!visible) return null

  return (
    <div className="card card--highlight" data-slot="banner" data-variant="highlight" role="region" aria-label="Instalação do aplicativo na tela inicial">
      <div className="card__header" data-slot="card-header">
        <div>
          <span className="badge badge--new" data-slot="badge" data-variant="new">PWA + WEB PUSH</span>
          <h2 className="card__title" data-slot="card-title" style={{ marginTop: 'var(--space-2)' }}>
            Instale o Playbook na tela inicial para receber avisos push
          </h2>
        </div>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={dismiss}
        >
          Não mostrar novamente
        </button>
      </div>
      <p className="card__meta" style={{ margin: '0 0 var(--space-3) 0' }}>
        No iPhone/iOS (16.4+), o Web Push exige que o app esteja na Tela de Início (toque em{' '}
        <strong>Compartilhar</strong> → <strong>Adicionar à Tela de Início</strong>). Enquanto o push não estiver ativo,
        os avisos chegam por <strong>e-mail</strong>.
      </p>
      <div className="btn-row">
        <button type="button" className="btn btn--primary" onClick={dismiss}>
          Ativar notificações push neste aparelho
        </button>
      </div>
    </div>
  )
}
