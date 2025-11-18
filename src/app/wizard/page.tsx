import { CurrencyCombobox } from '@/components/CurrencyCombobox'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { currentUser } from '@clerk/nextjs/server'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const user = await currentUser()

	if (!user) redirect('/sign-in')

	return (
		<div className='container flex flex-col justify-between items-center gap-4'>
			<h1 className='text-3xl text-center'>
				Welcome, <span className='font-bold ml-1'>{user.firstName}!</span>
			</h1>
			<h2 className='text-muted-foreground text-base text-center'>
				Let's get started by setting up your currency here.
			</h2>
			<h3 className='text-muted-foreground text-sm text-center'>
				You can change this setting anytime.
			</h3>
			<Separator />
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Currency</CardTitle>
					<CardDescription>
						Set your default currency for transactions...
					</CardDescription>
				</CardHeader>
				<CardContent className='w-full'>
					<CurrencyCombobox />
				</CardContent>
			</Card>
			<Separator />
			<Button
				variant='outline'
				className='w-full flex items-center group'
				asChild>
				<Link href='/'>
					I'm done, please take me to the dashboard.
					<ArrowRight className='group-hover:translate-x-1 duration-300 ease-in-out' />
				</Link>
			</Button>
		</div>
	)
}
