import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { cn } from '../../../lib/utils'

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  titleId: string
  descriptionId: string
}

const DialogContext = createContext<DialogContextValue | null>(null)

function useDialog() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('Dialog parts must be rendered inside <Dialog>')
  return ctx
}

export interface DialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

export function Dialog({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const titleId = useId()
  const descriptionId = useId()

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <DialogContext.Provider value={{ open, setOpen, titleId, descriptionId }}>
      {children}
    </DialogContext.Provider>
  )
}

export interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function DialogTrigger({
  asChild,
  children,
  ...props
}: DialogTriggerProps) {
  const { setOpen } = useDialog()

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<
      React.ButtonHTMLAttributes<HTMLButtonElement>
    >
    return React.cloneElement(child, {
      ...props,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        child.props.onClick?.(event)
        setOpen(true)
      },
    })
  }

  return (
    <button
      type="button"
      data-slot="dialog-trigger"
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  )
}

export interface DialogContentProps
  extends React.DialogHTMLAttributes<HTMLDialogElement> {
  children: React.ReactNode
}

export function DialogContent({
  children,
  className,
  onClick,
  ...props
}: DialogContentProps) {
  const { open, setOpen, titleId, descriptionId } = useDialog()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const close = () => setOpen(false)
    dialog.addEventListener('close', close)
    return () => dialog.removeEventListener('close', close)
  }, [setOpen])

  return (
    <dialog
      ref={ref}
      data-slot="dialog"
      aria-modal="true"
      className={cn('ui-dialog', className)}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={(event) => {
        // Close when clicking the backdrop (the dialog element itself, not its children)
        if (event.target === event.currentTarget) {
          setOpen(false)
        }
        onClick?.(event)
      }}
      {...props}
    >
      <div className="ui-dialog__panel" data-slot="dialog-panel">
        {children}
      </div>
    </dialog>
  )
}

export function DialogHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="dialog-header" className={cn('ui-dialog__header', className)} {...props}>
      {children}
    </div>
  )
}

export function DialogTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const { titleId } = useDialog()
  return (
    <h2
      id={titleId}
      data-slot="dialog-title"
      className={cn('ui-dialog__title', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

export function DialogDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId } = useDialog()
  return (
    <p
      id={descriptionId}
      data-slot="dialog-description"
      className={cn('ui-dialog__description', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function DialogFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="dialog-footer" className={cn('ui-dialog__footer', className)} {...props}>
      {children}
    </div>
  )
}

export interface DialogCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function DialogClose({ onClick, ...props }: DialogCloseProps) {
  const { setOpen } = useDialog()
  return (
    <button
      type="button"
      data-slot="dialog-close"
      onClick={(event) => {
        setOpen(false)
        onClick?.(event)
      }}
      {...props}
    />
  )
}
