import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import z from 'zod'

export async function GET(request: Request) {
	const user = await currentUser()

	if (!user) return redirect('/sign-in')

	const { searchParams } = new URL(request.url)
	const paramType = searchParams.get('type')

	const queryParams = z
		.enum(['income', 'expense'])
		.nullable()
		.safeParse(paramType)

	if (!queryParams.success) {
		return Response.json(queryParams.error, {
			status: 400,
		})
	}
	
	const type = queryParams.data
	
	
	const categories = await prisma.category.findMany({
		where: {
			userId: user.id,
			...(type && { type }),
		},
		orderBy : {
			name : "asc"
		}
	})
	console.log(categories)
	return Response.json(categories)
}
