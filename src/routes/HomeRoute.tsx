import { Navigate } from 'react-router'
import { StatusMessage } from '../components/ui/StatusMessage/StatusMessage'
import { useContents } from '../features/content/hooks/useContents'

/** "/" を開いたときは、一覧の先頭のページに移動する */
export function HomeRoute() {
  const { data: contents, isPending, isError } = useContents()

  if (isPending) return <StatusMessage>読み込み中…</StatusMessage>
  if (isError)
    return (
      <StatusMessage tone="error">
        ページ一覧を読み込めませんでした
      </StatusMessage>
    )

  const [first] = contents
  if (!first)
    return (
      <StatusMessage>
        ページがありません。サイドバーから作成してください
      </StatusMessage>
    )

  return <Navigate to={`/pages/${first.id}`} replace />
}
