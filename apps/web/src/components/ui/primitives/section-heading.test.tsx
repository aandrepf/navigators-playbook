import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectionHeading } from './section-heading'

describe('SectionHeading', () => {
  it('renders tagline, title and body with data-slots', () => {
    render(
      <SectionHeading
        tagline="Playbook"
        title="Próximas jogadas"
        body="Jogadas adicionadas esta semana"
      />,
    )

    expect(document.querySelector('[data-slot="section-heading"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="section-heading-tagline"]')).toHaveTextContent('Playbook')
    expect(screen.getByRole('heading', { name: /próximas jogadas/i })).toHaveAttribute(
      'data-slot',
      'section-heading-title',
    )
    expect(document.querySelector('[data-slot="section-heading-body"]')).toHaveTextContent(
      'Jogadas adicionadas esta semana',
    )
  })

  it.each(['left', 'center', 'space-between'] as const)(
    'applies justification %s',
    (justification) => {
      render(<SectionHeading title="Título" justification={justification} />)
      expect(document.querySelector('[data-slot="section-heading"]')).toHaveAttribute(
        'data-justification',
        justification,
      )
    },
  )

  it('renders actions', () => {
    render(
      <SectionHeading title="Título">
        <button type="button">Nova</button>
      </SectionHeading>,
    )
    expect(document.querySelector('[data-slot="section-heading-actions"]')).toContainElement(
      screen.getByRole('button', { name: /nova/i }),
    )
  })
})
