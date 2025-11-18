'use server'

import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function DeleteTransaction(id: string) {
	const user = await currentUser()
	if (!user) redirect('/sign-in')

	const transaction = await prisma.transactions.findUnique({
		where: {
			userId: user.id,
			id,
		},
	})

	if (!transaction) throw new Error("Transaction doesn't exist!")

	await prisma.$transaction([
		prisma.transactions.delete({
			where: {
				userId: user.id,
				id,
			},
		}),
	])

	await prisma.monthHistory.update({
		where: {
			day_month_year_userId: {
				userId: user.id,
				day: transaction.date.getUTCDate(),
				month: transaction.date.getUTCMonth(),
				year: transaction.date.getUTCFullYear(),
			},
		},
		data: {
			...(transaction.type === 'expense' && {
				expense: {
					decrement: transaction.amount,
				},
			}),
			...(transaction.type === 'income' && {
				income: {
					decrement: transaction.amount,
				},
			}),
		},
	})
	await prisma.yearHistory.update({
		where: {
			month_year_userId: {
				userId: user.id,
				month: transaction.date.getUTCMonth(),
				year: transaction.date.getUTCFullYear(),
			},
		},
		data: {
			...(transaction.type === 'expense' && {
				expense: {
					decrement: transaction.amount,
				},
			}),
			...(transaction.type === 'income' && {
				income: {
					decrement: transaction.amount,
				},
			}),
		},
	})
}
