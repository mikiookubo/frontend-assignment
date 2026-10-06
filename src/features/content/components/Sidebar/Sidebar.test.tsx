import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'
import type { Content } from '../../../../api/content'
import { Sidebar } from './Sidebar'

function createPage(id: number, title: string): Content {
  const now = new Date().toISOString()
  return { id, title, body: null, createdAt: now, updatedAt: now }
}

/** バックエンドの代わりに、メモリ上の配列でページを管理する */
let pages: Content[] = []

const server = setupServer(
  http.get('/content', () => HttpResponse.json(pages)),
  http.post('/content', async ({ request }) => {
    const { title } = (await request.json()) as { title: string }
    const created = createPage(
      Math.max(0, ...pages.map((p) => p.id)) + 1,
      title,
    )
    pages = [...pages, created]
    return HttpResponse.json(created, { status: 201 })
  }),
  http.delete('/content/:id', ({ params }) => {
    pages = pages.filter((page) => page.id !== Number(params.id))
    return new HttpResponse(null, { status: 204 })
  }),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

beforeEach(() => {
  pages = [createPage(1, 'こころ'), createPage(2, '坊ちゃん')]
})

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </QueryClientProvider>,
  )
  return { user: userEvent.setup() }
}

describe('Sidebar', () => {
  it('API から取得したページの一覧を表示する', async () => {
    setup()

    expect(
      await screen.findByRole('link', { name: 'こころ' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '坊ちゃん' })).toBeInTheDocument()
  })

  it('New page でページを作成し、そのページに移動する', async () => {
    const { user } = setup()
    await screen.findByRole('link', { name: 'こころ' })

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.click(screen.getByRole('button', { name: 'New page' }))

    expect(
      await screen.findByRole('link', { name: '新しいページ' }),
    ).toHaveAttribute('aria-current', 'page')
  })

  it('確認ダイアログで Delete を押すと、ページを削除する', async () => {
    const { user } = setup()
    await screen.findByRole('link', { name: 'こころ' })

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.click(screen.getByRole('button', { name: '「こころ」を削除' }))
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Delete',
      }),
    )

    await expect
      .poll(() => screen.queryByRole('link', { name: 'こころ' }))
      .toBeNull()
    expect(screen.getByRole('link', { name: '坊ちゃん' })).toBeInTheDocument()
  })

  it('作成に失敗したら、エラーを表示する', async () => {
    server.use(
      http.post('/content', () => new HttpResponse(null, { status: 500 })),
    )
    const { user } = setup()
    await screen.findByRole('link', { name: 'こころ' })

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.click(screen.getByRole('button', { name: 'New page' }))

    expect(
      await screen.findByText('ページを作成できませんでした'),
    ).toBeInTheDocument()
  })
})
