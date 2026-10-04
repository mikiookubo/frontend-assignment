import { useParams } from 'react-router'
import { StatusMessage } from '../components/ui/StatusMessage/StatusMessage'
import { useContent } from '../features/content/hooks/useContent'

export function ContentRoute() {
  const id = Number(useParams().id)

  if (!Number.isInteger(id))
    return <StatusMessage>ページが見つかりません</StatusMessage>

  return <ContentLoader id={id} />
}

function ContentLoader({ id }: { id: number }) {
  const { data: content, isPending, isError } = useContent(id)

  if (isPending) return <StatusMessage>読み込み中…</StatusMessage>
  if (isError)
    return (
      <StatusMessage tone="error">ページを読み込めませんでした</StatusMessage>
    )
  if (!content) return <StatusMessage>ページが見つかりません</StatusMessage>

  return (
    <article>
      <h1>{content.title}</h1>
      <p>{content.body}</p>
    </article>
  )
}
