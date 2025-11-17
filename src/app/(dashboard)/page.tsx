import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { MinusIcon, PlusIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import CreateTransactionsPopup from './_components/CreateTransactionsPopup'
import Insight from './_components/Insight'

export default async function Home() {
	const user = await currentUser()

	if (!user) redirect('/sign-in')

	const userSettings = await prisma.userSettings.findUnique({
		where: {
			userId: user.id,
		},
	})

	if (!userSettings) redirect('/wizard')

	return (
		<div className='container mx-auto'>
			<div className='flex flex-col md:flex-row  justify-between items-center py-5 gap-5'>
				<h1 className='text-2xl md:text-4xl font-bold text-foreground'>
					Hello {user.firstName}!
				</h1>

				<div className='flex gap-4'>
					<CreateTransactionsPopup
						trigger={
							<Button className='bg-emerald-500 text-white hover:bg-emerald-700 cursor-pointer'>
								<PlusIcon />
								New Income
							</Button>
						}
						type='income'
					/>
					<CreateTransactionsPopup
						trigger={
							<Button className='bg-red-500 text-white hover:bg-red-700 cursor-pointer'>
								<MinusIcon />
								New Expense
							</Button>
						}
						type='expense'
					/>
				</div>
			</div>
			<Insight userSettings={userSettings} />
		</div>
	)
}
