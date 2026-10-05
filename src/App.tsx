import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { StatusMessage } from './components/ui/StatusMessage/StatusMessage'
import { ContentRoute } from './routes/ContentRoute'
import { HomeRoute } from './routes/HomeRoute'
import { RootRoute } from './routes/RootRoute'
import { paths } from './lib/paths'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
})

const router = createBrowserRouter([
  {
    path: paths.home,
    element: <RootRoute />,
    children: [
      { index: true, element: <HomeRoute /> },
      { path: paths.pagePattern, element: <ContentRoute /> },
      {
        path: '*',
        element: <StatusMessage>ページが見つかりません</StatusMessage>,
      },
    ],
  },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
