import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteContent } from '../../../api/content'
import { contentKeys } from '../queryKeys'

export function useDeleteContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteContent,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: contentKeys.detail(id) })
      return queryClient.invalidateQueries({
        queryKey: contentKeys.all,
        exact: true,
      })
    },
  })
}
