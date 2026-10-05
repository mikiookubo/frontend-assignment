import { useEffect, useId, useRef } from 'react'
import { Button } from '../Button/Button'
import type { IconName } from '../Icon/Icon'
import styles from './ConfirmDialog.module.css'

type Props = {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  confirmIcon?: IconName
  onConfirm: () => void
  onCancel: () => void
  /** 処理中は二重送信を防ぐため、どちらのボタンも押せなくする */
  isPending?: boolean
}

/**
 * ネイティブの <dialog> を使った確認ダイアログ。
 * showModal() で開くと、背景の操作の無効化・フォーカスの閉じ込め・Esc での取消をブラウザが担う。
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  confirmIcon = 'done',
  onConfirm,
  onCancel,
  isPending = false,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Esc で閉じたときも、開閉の状態は親の open で管理する
        event.preventDefault()
        if (!isPending) onCancel()
      }}
    >
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <Button
          icon="cancel"
          label="Cancel"
          variant="normal"
          onClick={onCancel}
          disabled={isPending}
        />
        <Button
          icon={confirmIcon}
          label={confirmLabel}
          onClick={onConfirm}
          disabled={isPending}
        />
      </div>
    </dialog>
  )
}
