export const UNTITLED = '無題'

/** API ではタイトルが null や空文字になりうるため、表示用の文字列にそろえる */
export function displayTitle(title: string | null): string {
  return title?.trim() || UNTITLED
}
