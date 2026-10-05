import { useParams } from 'react-router'
import { StatusMessage } from '../components/ui/StatusMessage/StatusMessage'
import { ContentPage } from '../features/content/components/ContentPage/ContentPage'
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

  // key を付けて、ページを切り替えたときに編集中の状態を初期化する
  return <ContentPage key={content.id} content={content} />
}
