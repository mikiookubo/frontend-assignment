import { useState } from 'react'
import { useMatch, useNavigate } from 'react-router'
import type { Content } from '../../../../api/content'
import { Logo } from '../../../../components/layout/Logo/Logo'
import { Button } from '../../../../components/ui/Button/Button'
import { ConfirmDialog } from '../../../../components/ui/ConfirmDialog/ConfirmDialog'
import { StatusMessage } from '../../../../components/ui/StatusMessage/StatusMessage'
import { paths } from '../../../../lib/paths'
import { displayTitle } from '../../displayTitle'
import { useContents } from '../../hooks/useContents'
import { useCreateContent } from '../../hooks/useCreateContent'
import { useDeleteContent } from '../../hooks/useDeleteContent'
import { SidebarItem } from '../SidebarItem/SidebarItem'
import styles from './Sidebar.module.css'

const NEW_PAGE_TITLE = '新しいページ'

export function Sidebar() {
  const { data: contents, isPending, isError } = useContents()
  const createContent = useCreateContent()
  const deleteContent = useDeleteContent()
  const [isEditing, setIsEditing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Content | null>(null)
  const navigate = useNavigate()
  // サイドバーは親のルートにあるため、URL から表示中のページの id を取り出す
  const currentId = Number(useMatch(paths.pagePattern)?.params.id)

  const handleCreate = () => {
    createContent.mutate(
      { title: NEW_PAGE_TITLE },
      { onSuccess: (created) => navigate(paths.page(created.id)) },
    )
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    const { id } = deleteTarget
    deleteContent.mutate(id, {
      onSuccess: () => {
        // 表示中のページを消したときは、"/"（先頭のページへ移動する）に戻す
        if (id === currentId) navigate(paths.home, { replace: true })
      },
      onSettled: () => setDeleteTarget(null),
    })
  }

  const handleDone = () => {
    setIsEditing(false)
    // 編集モードを抜けたら、作成・削除の失敗メッセージも消す
    createContent.reset()
    deleteContent.reset()
  }

  const isMutating = createContent.isPending || deleteContent.isPending

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <Logo />
      </div>

      <nav className={styles.nav} aria-label="ページ一覧">
        {isPending ? (
          <StatusMessage>読み込み中…</StatusMessage>
        ) : isError ? (
          <StatusMessage tone="error">
            ページ一覧を読み込めませんでした
          </StatusMessage>
        ) : (
          <ul>
            {contents.map((content) => (
              <SidebarItem
                key={content.id}
                content={content}
                isEditing={isEditing}
                onDelete={setDeleteTarget}
                deleteDisabled={isMutating}
              />
            ))}
          </ul>
        )}
        {createContent.isError && (
          <StatusMessage tone="error">
            ページを作成できませんでした
          </StatusMessage>
        )}
        {deleteContent.isError && (
          <StatusMessage tone="error">
            ページを削除できませんでした
          </StatusMessage>
        )}
      </nav>

      <div className={styles.footer}>
        {isEditing ? (
          <>
            <Button
              icon="plus"
              label="New page"
              variant="secondary"
              onClick={handleCreate}
              disabled={isMutating}
            />
            <Button
              icon="done"
              label="Done"
              onClick={handleDone}
              disabled={isMutating}
            />
          </>
        ) : (
          <Button icon="edit" label="Edit" onClick={() => setIsEditing(true)} />
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="ページを削除しますか？"
        message={
          deleteTarget
            ? `「${displayTitle(deleteTarget.title)}」を削除します。この操作は取り消せません。`
            : ''
        }
        confirmLabel="Delete"
        confirmIcon="delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={deleteContent.isPending}
      />
    </div>
  )
}
