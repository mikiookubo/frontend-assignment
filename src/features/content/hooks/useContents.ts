import { useQuery } from '@tanstack/react-query'
import { fetchContents } from '../../../api/content'
import { contentKeys } from '../queryKeys'

export function useContents() {
  return useQuery({
    queryKey: contentKeys.all,
    queryFn: fetchContents,
  })
}
