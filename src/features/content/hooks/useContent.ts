import { useQuery } from '@tanstack/react-query'
import { fetchContent } from '../../../api/content'
import { contentKeys } from '../queryKeys'

export function useContent(id: number) {
  return useQuery({
    queryKey: contentKeys.detail(id),
    queryFn: () => fetchContent(id),
  })
}
