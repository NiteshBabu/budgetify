import { CURRENCIES } from '@/components/CurrencyCombobox'
import z from 'zod'

export const UpdateUserCurrencySchema = z.object({
	code: z.string(),
  label: z.string(),
  locale: z.string()
})
