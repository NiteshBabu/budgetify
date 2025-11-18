import { prisma } from '@/lib/prisma'
import { PeriodType, TimeframeType } from '@/lib/types'
import { currentUser } from '@clerk/nextjs/server'
import { getDaysInMonth } from 'date-fns'
import { redirect } from 'next/navigation'
import z from 'zod'

const GetHistoryDataSchema = z.object({
	timeframe: z.enum(['month', 'year']),
	month: z.coerce.number().min(0).max(11).default(0),
	year: z.coerce.number().min(2000).max(3000),
})

export async function GET(req: Response) {
	const user = await currentUser()

	if (!user) redirect('/sign-in')

	const { searchParams } = new URL(req.url)

	const timeframe = searchParams.get('timeframe')
	const month = searchParams.get('month')
	const year = searchParams.get('year')

	const queryParams = GetHistoryDataSchema.safeParse({
		timeframe,
		year,
		month,
	})

	if (!queryParams.success) {
		return Response.json(queryParams.error, {
			status: 400,
		})
	}
	const data = await getHistoryData(user.id, queryParams.data.timeframe, {
		month: queryParams.data.month,
		year: queryParams.data.year,
	})
	return Response.json(data)
}

export type GetHistoryDataResponseType = Awaited<
	ReturnType<typeof getHistoryData>
>

async function getHistoryData(
	userId: string,
	timeframe: TimeframeType,
	period: PeriodType
) {
	let results = []
	switch (timeframe) {
		case 'month':
			let monthHistoryResults = await prisma.monthHistory.groupBy({
				by: ['day'],
				where: {
					userId,
					...period,
				},
				_sum: {
					income: true,
					expense: true,
				},
				orderBy: {
					day: 'asc',
				},
			})

			for (
				let i = 0;
				i < getDaysInMonth(new Date(period.year, period.month));
				i++
			) {
				let income = 0
				let expense = 0

				const day = monthHistoryResults.find((row) => row.day === i)
				if (day) {
					income += day._sum.income || 0
					expense += day._sum.expense || 0
				}

				results.push({
					year: period.year,
					month: period.month,
					day: i,
					income,
					expense,
				})
			}
			break
		case 'year':
			let yearHistoryResults = await prisma.yearHistory.groupBy({
				by: ['month'],
				where: {
					userId,
					year: period.year,
				},
				_sum: {
					income: true,
					expense: true,
				},
				orderBy: {
					month: 'asc',
				},
			})
			for (let i = 0; i < 12; i++) {
				let income = 0
				let expense = 0

				const month = yearHistoryResults.find((row) => row.month === i)
				if (month) {
					income += month._sum.income || 0
					expense += month._sum.expense || 0
				}

				results.push({
					year: period.year,
					month: i,
					income,
					expense,
				})
			}
	}

	return results
}
