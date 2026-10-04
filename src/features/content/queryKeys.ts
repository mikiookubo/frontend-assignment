/** キャッシュのキーを 1 か所で定義し、取得と無効化で同じキーを使う */
export const contentKeys = {
  all: ['contents'] as const,
  detail: (id: number) => [...contentKeys.all, id] as const,
}
