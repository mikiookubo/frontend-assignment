export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * fetch を包み、JSON の送受信とエラー処理をまとめる。
 * 本文が空のレスポンス（204 や、存在しない id を GET したとき）は null を返す。
 */
export async function request(
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  const response = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `${init?.method ?? 'GET'} ${path} が失敗しました（${response.status}）`,
    )
  }

  const text = await response.text()
  return text === '' ? null : JSON.parse(text)
}
