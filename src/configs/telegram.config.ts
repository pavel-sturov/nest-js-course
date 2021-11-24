import { ITelegramOptions } from '../telegram/telegram.interface'

export const getTelegramConfig = (): ITelegramOptions => ({
  token:  '',
  chatId: '',
})