import type { Content } from '../../../../api/content'
import { EditableField } from '../../../../components/ui/EditableField/EditableField'
import { useUpdateContent } from '../../hooks/useUpdateContent'
import { bodySchema, titleSchema } from '../../schema'
import styles from './ContentPage.module.css'

type Props = {
  content: Content
}

/** メインエリアのカード。タイトルと本文は、それぞれ独立して編集・保存できる */
export function ContentPage({ content }: Props) {
  const updateContent = useUpdateContent(content.id)

  return (
    <article className={styles.page}>
      <EditableField
        variant="title"
        label="タイトル"
        value={content.title}
        schema={titleSchema}
        onSave={(title) => updateContent.mutateAsync({ title })}
      />
      <EditableField
        variant="body"
        label="本文"
        value={content.body}
        schema={bodySchema}
        onSave={(body) => updateContent.mutateAsync({ body })}
      />
    </article>
  )
}
