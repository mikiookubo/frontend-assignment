import { describe, expect, it } from 'vitest'
import { bodySchema, titleSchema } from './schema'

describe('titleSchema', () => {
  it.each([
    [0, false],
    [1, true],
    [50, true],
    [51, false],
  ])('%i 文字のとき valid=%s', (length, valid) => {
    expect(titleSchema.safeParse('a'.repeat(length)).success).toBe(valid)
  })

  it('空白だけの入力は通さない', () => {
    expect(titleSchema.safeParse('   ').success).toBe(false)
  })
})

describe('bodySchema', () => {
  it.each([
    [9, false],
    [10, true],
    [2000, true],
    [2001, false],
  ])('%i 文字のとき valid=%s', (length, valid) => {
    expect(bodySchema.safeParse('a'.repeat(length)).success).toBe(valid)
  })

  it('前後の空白は文字数に数えない', () => {
    expect(bodySchema.safeParse(` ${'a'.repeat(9)} `).success).toBe(false)
  })
})
