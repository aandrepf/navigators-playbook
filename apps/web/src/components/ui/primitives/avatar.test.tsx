import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar } from './avatar'

describe('Avatar', () => {
  it('renders initials fallback with data-slot', () => {
    render(<Avatar alt="Rafael Costa" />)

    const avatar = document.querySelector('[data-slot="avatar"]')
    expect(avatar).toBeInTheDocument()
    expect(screen.getByText('RC')).toHaveAttribute('data-slot', 'avatar-fallback')
  })

  it('renders an image when src is provided', () => {
    render(<Avatar src="/photo.png" alt="Rafael Costa" />)
    const img = screen.getByAltText('Rafael Costa')
    expect(img).toHaveAttribute('src', '/photo.png')
    expect(img).toHaveClass('ui-avatar__image')
  })

  it.each(['sm', 'default', 'lg'] as const)('applies size %s', (size) => {
    render(<Avatar alt="Rafael Costa" size={size} />)
    expect(document.querySelector('[data-slot="avatar"]')).toHaveAttribute('data-size', size)
  })

  it('shows badge when showBadge is true', () => {
    render(<Avatar alt="Rafael Costa" showBadge />)
    expect(document.querySelector('.ui-avatar__badge')).toBeInTheDocument()
  })
})
