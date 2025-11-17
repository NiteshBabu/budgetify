import { MAX_DATE_RANGE } from '@/lib/constants'
import { differenceInDays } from 'date-fns'
import z from 'zod'

export const InsightQuerySchema = z
	.object({
		from: z.coerce.date(),
		to: z.coerce.date(),
	})
	.refine(({ from, to }) => {
		const days = differenceInDays(to, from)
		const inRange = days >= 0 && days <= MAX_DATE_RANGE

		return inRange
	})

export type InsightQuerySchemaType = z.infer<typeof InsightQuerySchema>
