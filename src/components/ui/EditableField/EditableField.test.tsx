import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { titleSchema } from '../../../features/content/schema'
import { EditableField } from './EditableField'

function setup(onSave = vi.fn().mockResolvedValue(undefined)) {
  render(
    <EditableField
      variant="title"
      label="タイトル"
      value="元のタイトル"
      schema={titleSchema}
      onSave={onSave}
    />,
  )
  return { user: userEvent.setup(), onSave }
}

describe('EditableField', () => {
  it('Edit を押すと、今の値が入った入力欄になる', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Edit' }))

    expect(screen.getByRole('textbox', { name: 'タイトル' })).toHaveValue(
      '元のタイトル',
    )
  })

  it('不正な入力ではエラーを表示し、Save を押せない', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.clear(screen.getByRole('textbox', { name: 'タイトル' }))

    expect(
      screen.getByText('タイトルは1〜50文字で入力してください'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('Save を押すと前後の空白を除いた値で保存し、表示に戻る', async () => {
    const { user, onSave } = setup()

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    const input = screen.getByRole('textbox', { name: 'タイトル' })
    await user.clear(input)
    await user.type(input, '  新しいタイトル  ')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSave).toHaveBeenCalledWith('新しいタイトル')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('保存に失敗したらエラーを表示し、編集を続けられる', async () => {
    const { user } = setup(vi.fn().mockRejectedValue(new Error()))

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('保存できませんでした')).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'タイトル' }),
    ).toBeInTheDocument()
  })

  it('Cancel を押すと保存せずに元の値の表示に戻る', async () => {
    const { user, onSave } = setup()

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.type(screen.getByRole('textbox', { name: 'タイトル' }), '追記')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onSave).not.toHaveBeenCalled()
    expect(
      screen.getByRole('heading', { name: '元のタイトル' }),
    ).toBeInTheDocument()
  })
})
