import { NavLink } from 'react-router'
import type { Content } from '../../../../api/content'
import { IconButton } from '../../../../components/ui/IconButton/IconButton'
import { paths } from '../../../../lib/paths'
import { displayTitle } from '../../displayTitle'
import styles from './SidebarItem.module.css'

type Props = {
  content: Content
  isEditing: boolean
  onDelete: (content: Content) => void
  deleteDisabled?: boolean
}

export function SidebarItem({
  content,
  isEditing,
  onDelete,
  deleteDisabled = false,
}: Props) {
  const title = displayTitle(content.title)

  return (
    <li className={styles.item}>
      <NavLink
        to={paths.page(content.id)}
        className={({ isActive }) =>
          [styles.link, isActive && styles.active, isEditing && styles.editing]
            .filter(Boolean)
            .join(' ')
        }
      >
        <span className={styles.title}>{title}</span>
      </NavLink>
      {isEditing && (
        <IconButton
          icon="delete"
          aria-label={`「${title}」を削除`}
          className={styles.deleteButton}
          onClick={() => onDelete(content)}
          disabled={deleteDisabled}
        />
      )}
    </li>
  )
}
