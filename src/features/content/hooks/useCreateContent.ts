import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createContent } from '../../../api/content'
import { contentKeys } from '../queryKeys'

export function useCreateContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createContent,
    onSuccess: (created) => {
      queryClient.setQueryData(contentKeys.detail(created.id), created)
      return queryClient.invalidateQueries({
        queryKey: contentKeys.all,
        exact: true,
      })
    },
  })
}
