import { cn } from '../../../lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image source. When absent, initials fallback is used. */
  src?: string
  /** Alt text for the image; also used to derive initials. */
  alt: string
  /** Visual size. */
  size?: 'sm' | 'default' | 'lg'
  /** Show a status dot indicator. */
  showBadge?: boolean
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Avatar({
  src,
  alt,
  size = 'default',
  showBadge = false,
  className,
  children,
  ...props
}: AvatarProps) {
  const initials = getInitials(alt)

  return (
    <span
      data-slot="avatar"
      data-size={size}
      className={cn('ui-avatar', className)}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="ui-avatar__image"
          loading="lazy"
          onError={(event) => {
            const img = event.currentTarget
            img.style.display = 'none'
          }}
        />
      ) : (
        <span className="ui-avatar__fallback" data-slot="avatar-fallback" aria-hidden="true">
          {children ?? initials}
        </span>
      )}
      {showBadge && <span className="ui-avatar__badge" aria-hidden="true" />}
    </span>
  )
}
