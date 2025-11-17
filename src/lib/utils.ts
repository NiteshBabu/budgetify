import { CURRENCIES } from '@/components/CurrencyCombobox'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function DateToUTCDate(date: Date) {
	return new Date(
		Date.UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds()
		)
	)
}

export function GetCurrencyFormatter(currency: string){
  const locale = CURRENCIES.find(c => c.code === currency)?.locale
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  })
}
