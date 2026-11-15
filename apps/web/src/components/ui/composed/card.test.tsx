import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card'

describe('Card', () => {
  it('renders all slots and applies variant/size data attributes', () => {
    render(
      <Card variant="highlight" size="sm" data-testid="card">
        <CardHeader data-testid="header">
          <CardTitle>Título</CardTitle>
          <CardDescription>Descrição</CardDescription>
        </CardHeader>
        <CardContent data-testid="content">Conteúdo</CardContent>
        <CardFooter data-testid="footer">Rodapé</CardFooter>
      </Card>,
    )

    const card = screen.getByTestId('card')
    expect(card).toHaveAttribute('data-slot', 'card')
    expect(card).toHaveAttribute('data-variant', 'highlight')
    expect(card).toHaveAttribute('data-size', 'sm')

    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'card-header')
    expect(screen.getByRole('heading', { name: /título/i })).toHaveAttribute('data-slot', 'card-title')
    expect(screen.getByText('Descrição')).toHaveAttribute('data-slot', 'card-description')
    expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'card-content')
    expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'card-footer')
  })
})
