import { cn } from '../../../lib/utils'

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLElement> {
  /** Optional eyebrow text rendered as a tagline. */
  tagline?: string
  /** Main heading text. */
  title: string
  /** Optional body description. */
  body?: string
  /** Horizontal alignment / justification. */
  justification?: 'left' | 'center' | 'space-between'
  /** Responsive size. */
  size?: 'large' | 'small'
}

export function SectionHeading({
  tagline,
  title,
  body,
  justification = 'left',
  size = 'large',
  children,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <header
      data-slot="section-heading"
      data-justification={justification}
      data-size={size}
      className={cn('ui-section-heading', className)}
      {...props}
    >
      <div className="ui-section-heading__text">
        {tagline && (
          <span className="ui-section-heading__tagline" data-slot="section-heading-tagline">
            {tagline}
          </span>
        )}
        <h2 className="ui-section-heading__title" data-slot="section-heading-title">
          {title}
        </h2>
        {body && (
          <p className="ui-section-heading__body" data-slot="section-heading-body">
            {body}
          </p>
        )}
      </div>
      {children && (
        <div className="ui-section-heading__actions" data-slot="section-heading-actions">
          {children}
        </div>
      )}
    </header>
  )
}
