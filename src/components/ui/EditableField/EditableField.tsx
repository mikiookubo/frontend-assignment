import {
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import type { z } from 'zod'
import { Button } from '../Button/Button'
import styles from './EditableField.module.css'

type Props = {
  /** title: 1 行の入力欄 / body: 複数行の入力欄 */
  variant: 'title' | 'body'
  label: string
  value: string | null
  schema: z.ZodType<string>
  onSave: (value: string) => Promise<unknown>
}

/** タイトルと本文に共通の「表示 ⇄ 編集」の部品。Edit で編集、Cancel で取り消し、Save で保存する */
export function EditableField({
  variant,
  label,
  value,
  schema,
  onSave,
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [hasSaveError, setHasSaveError] = useState(false)
  const [isSaving, startTransition] = useTransition()

  const result = schema.safeParse(draft)
  const error = hasSaveError
    ? '保存できませんでした'
    : result.success
      ? null
      : result.error.issues[0]?.message

  const startEditing = () => {
    setDraft(value ?? '')
    setHasSaveError(false)
    setIsEditing(true)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!result.success) return
    // 保存が終わるまで isSaving が true になり、ボタンを押せなくする
    startTransition(async () => {
      try {
        await onSave(result.data)
        setIsEditing(false)
      } catch {
        setHasSaveError(true)
      }
    })
  }

  const inputProps = {
    className: styles.input,
    value: draft,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft(event.target.value)
      setHasSaveError(false)
    },
    'aria-label': label,
    'aria-invalid': error != null,
    autoFocus: true,
  }

  return (
    <form
      className={[styles.field, styles[variant]].join(' ')}
      aria-label={label}
      onSubmit={handleSubmit}
    >
      <div className={styles.content}>
        {isEditing ? (
          <>
            {variant === 'title' ? (
              <input {...inputProps} />
            ) : (
              <textarea {...inputProps} />
            )}
            {error && <p className={styles.error}>{error}</p>}
          </>
        ) : variant === 'title' ? (
          <h1 className={styles.value}>{value}</h1>
        ) : (
          <p className={styles.value}>{value}</p>
        )}
      </div>

      {/* key を分けて、Edit を押した直後に同じ要素が Save（submit）に変わって送信されるのを防ぐ */}
      <div className={styles.actions}>
        {isEditing ? (
          <>
            <Button
              key="cancel"
              icon="cancel"
              label="Cancel"
              variant="normal"
              size="compact"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            />
            <Button
              key="save"
              type="submit"
              icon="save"
              label="Save"
              size="compact"
              disabled={!result.success || isSaving}
            />
          </>
        ) : (
          <Button key="edit" icon="edit" label="Edit" onClick={startEditing} />
        )}
      </div>
    </form>
  )
}
