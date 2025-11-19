import { prisma } from '@/lib/prisma'
import { GetCurrencyFormatter } from '@/lib/utils'
import { InsightQuerySchema } from '@/schema/insight'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
	const user = await currentUser()
	if (!user) redirect('sign-in')

	const searchParams = new URL(request.url).searchParams

	const from = searchParams.get('from')
	const to = searchParams.get('to')

	const parsedBody = InsightQuerySchema.safeParse({
		from,
		to,
	})
	if (!parsedBody.success) {
		return Response.json(parsedBody.error, {
			status: 400,
		})
	}

	return Response.json(
		await GetTransactionHistory(
			user.id,
			parsedBody.data.from,
			parsedBody.data.to
		)
	)
}

export type GetTransactionHistoryResponseType = Awaited<
	ReturnType<typeof GetTransactionHistory>
>

const GetTransactionHistory = async (userId: string, from: Date, to: Date) => {
	const userSettings = await prisma.userSettings.findUnique({
		where: {
			userId,
		},
	})

	if (!userSettings) redirect('/wizard')

	const formatter = GetCurrencyFormatter(userSettings.currency)

	const transactions = await prisma.transactions.findMany({
		where: {
			userId: userId,
			date: {
				gte: from,
				lte: to,
			},
		},
	})

	return transactions.map((transaction) => ({
		...transaction,
		amount: formatter.format(transaction.amount),
	}))
}
