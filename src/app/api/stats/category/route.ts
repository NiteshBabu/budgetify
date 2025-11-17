import { prisma } from '@/lib/prisma'
import { InsightQuerySchema } from '@/schema/insight'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function GET(req: Request) {
	const user = await currentUser()

	if (!user) redirect('/sign-in')

	const { searchParams } = new URL(req.url)
	const from = searchParams.get('from')
	const to = searchParams.get('to')

	const queryParams = InsightQuerySchema.safeParse({ from, to })

	if (!queryParams.success) {
		return Response.json(queryParams.error, {
			status: 400,
		})
	}
	// const transactions = await prisma.transactions.groupBy({
	// 	by: 'type',
	// 	where: {
	// 		userId: user.id,
	// 	},
	//   _sum: {
	//     amount: true
	//   }
	// })
	// console.log(transactions)

	const stats = await getCategoryStats(
		user.id,
		queryParams.data?.from,
		queryParams.data.to
	)
	return Response.json(stats)
}

export type GetCategoryStatsResponseType = Awaited<
	ReturnType<typeof getCategoryStats>
>
async function getCategoryStats(userId: string, from: Date, to: Date) {
	const totals = await prisma.transactions.groupBy({
		by: ['type', 'category'],
		where: {
			userId,
			date: {
				gte: from,
				lte: to,
			},
		},
		_sum: {
			amount: true,
		},
		orderBy: {
			_sum: {
				amount: 'desc',
			},
		},
	})
	return totals
}
