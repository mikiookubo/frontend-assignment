import { z } from 'zod'

/** 前後の空白を除いた文字数を検証する（空白だけの入力を通さないため） */
function lengthSchema(label: string, min: number, max: number) {
  const message = `${label}は${min}〜${max}文字で入力してください`
  return z.string().trim().min(min, message).max(max, message)
}

export const titleSchema = lengthSchema('タイトル', 1, 50)
export const bodySchema = lengthSchema('本文', 10, 2000)
