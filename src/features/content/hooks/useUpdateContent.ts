import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateContent, type ContentInput } from '../../../api/content'
import { contentKeys } from '../queryKeys'

export function useUpdateContent(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ContentInput) => updateContent(id, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(contentKeys.detail(id), updated)
      // サイドバーのタイトルも変わるため、一覧を取り直す
      return queryClient.invalidateQueries({
        queryKey: contentKeys.all,
        exact: true,
      })
    },
  })
}
