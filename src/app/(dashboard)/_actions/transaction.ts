'use server'

import { prisma } from '@/lib/prisma'
import { TransactionType } from '@/lib/types'
import { DateToUTCDate } from '@/lib/utils'
import {
	CreateTransactionSchema,
	CreateTransactionSchemaType,
} from '@/schema/transaction'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function CreateTransaction(form: CreateTransactionSchemaType) {
	const parsedBody = CreateTransactionSchema.safeParse(form)

	if (!parsedBody.success) {
		throw new Error(parsedBody.error.message)
	}

	const user = await currentUser()
	if (!user) redirect('/sign-in')

	const data = parsedBody.data

	const category = prisma.category.findFirst({
		where: {
			userId: user.id,
			name: data.category,
		},
	})

	if (!category) throw new Error("Category doesn't exist!")

	// const transaction = await prisma.transactions.create({
	// 	data: {
	// 		userId: user.id,
	// 		...(data && { ...data }),
	// 		categoryIcon: '',
	// 	},
	// })

	await prisma.$transaction([
		// create user transaction
		prisma.transactions.create({
			data: {
				userId: user.id,
				...data,
				categoryIcon: data.category,
			},
		}),

		// update aggregates tables
		prisma.monthHistory.upsert({
			where: {
				day_month_year_userId: {
					userId: user.id,
					day: data.date.getUTCDate(),
					month: data.date.getUTCMonth(),
					year: data.date.getUTCFullYear(),
				},
			},
			create: {
				userId: user.id,
				day: data.date.getUTCDate(),
				month: data.date.getUTCMonth(),
				year: data.date.getUTCFullYear(),
				expense: data.type === 'expense' ? data.amount : 0,
				income: data.type === 'income' ? data.amount : 0,
			},
			update: {
				expense: {
					increment: data.type === 'expense' ? data.amount : 0,
				},
				income: {
					increment: data.type === 'income' ? data.amount : 0,
				},
			},
		}),

		prisma.yearHistory.upsert({
			where: {
				month_year_userId: {
					userId: user.id,
					month: data.date.getUTCMonth(),
					year: data.date.getUTCFullYear(),
				},
			},
			create: {
				userId: user.id,
				month: data.date.getUTCMonth(),
				year: data.date.getUTCFullYear(),
				expense: data.type === 'expense' ? data.amount : 0,
				income: data.type === 'income' ? data.amount : 0,
			},
			update: {
				expense: {
					increment: data.type === 'expense' ? data.amount : 0,
				},
				income: {
					increment: data.type === 'income' ? data.amount : 0,
				},
			},
		}),
	])
	// return transaction
}
