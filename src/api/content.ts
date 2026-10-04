import { z } from 'zod'
import { request } from './client'

/** API のレスポンスを境界で検証し、想定外のデータを画面に流さない */
const contentSchema = z.object({
  id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Content = z.infer<typeof contentSchema>
export type ContentInput = Partial<Pick<Content, 'title' | 'body'>>

const BASE_PATH = '/content'

export async function fetchContents(): Promise<Content[]> {
  return z.array(contentSchema).parse(await request(BASE_PATH))
}

/** バックエンドは存在しない id でも 200 と空の本文を返すため、その場合は null を返す */
export async function fetchContent(id: number): Promise<Content | null> {
  return contentSchema.nullable().parse(await request(`${BASE_PATH}/${id}`))
}

export async function createContent(input: ContentInput): Promise<Content> {
  return contentSchema.parse(
    await request(BASE_PATH, { method: 'POST', body: JSON.stringify(input) }),
  )
}

export async function updateContent(
  id: number,
  input: ContentInput,
): Promise<Content> {
  return contentSchema.parse(
    await request(`${BASE_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  )
}

export async function deleteContent(id: number): Promise<void> {
  await request(`${BASE_PATH}/${id}`, { method: 'DELETE' })
}
