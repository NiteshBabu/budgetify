import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import CreateTransactionsPopup from './_components/CreateTransactionsPopup'
import History from './_components/History'
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
		<div className='grid gap-10'>
			<div className='border-b bg-card py-10'>
				<div className='container mx-auto flex flex-col md:flex-row  justify-between md:items-center gap-5'>
					<div className=''>
						<h1 className='text-3xl font-mono md:text-5xl font-bold text-foreground'>
							Hello, <span className='text-colorful'>{user.firstName}!</span>
						</h1>
						<p className='text-muted-foreground'>Welcome to Budgetify!</p>
					</div>
					<div className='flex gap-4 ml-auto'>
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
			</div>
			<div className='container mx-auto grid gap-8'>
				<Insight userSettings={userSettings} />
				<History userSettings={userSettings} />
			</div>
		</div>
	)
}
