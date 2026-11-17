import { useState } from 'react'
import { Banner, Badge, Button } from './ui'

const STORAGE_KEY = 'playbook-pwa-banner-dismissed'

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
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
    <Banner
      variant="highlight"
      title="Instale o SnapIn na tela inicial para receber avisos push"
      description="No iPhone/iOS (16.4+), o Web Push exige que o app esteja na Tela de Início (toque em Compartilhar → Adicionar à Tela de Início). Enquanto o push não estiver ativo, os avisos chegam por e-mail."
      aria-label="Instalação do aplicativo na tela inicial"
    >
      <div className="badge-row" style={{ marginBottom: 'var(--space-2)' }}>
        <Badge variant="new">PWA + WEB PUSH</Badge>
        <Badge variant="outline">Convite único</Badge>
      </div>
      <div className="btn-row">
        <Button variant="default" size="sm" onClick={dismiss}>
          Ativar notificações push neste aparelho
        </Button>
        <Button variant="ghost" size="sm" onClick={dismiss}>
          Não mostrar novamente
        </Button>
      </div>
    </Banner>
  )
}
