'use client'

import { CurrencyCombobox } from '@/components/CurrencyCombobox'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { TransactionType } from '@/lib/types'
import { Category } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { TrashIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import CreateCategoryPopup from '../_components/CreateCategoryPopup'
import DeleteCategoryPopup from './_components/DeleteCategoryPopup'

function Page() {
	return (
		<div className='grid gap-5'>
			<div className='border-b bg-card'>
				<div className='container mx-auto flex flex-wrap items-center justify-between gap-5 py-10'>
					<div className=''>
						<h1 className='text-3xl md:text-5xl font-bold font-mono'>Manage</h1>
						<p className='text-muted-foreground'>
							Manage your account settings & categories here.
						</p>
					</div>
				</div>
			</div>
			<div className='container mx-auto flex flex-col gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Currency</CardTitle>
						<CardDescription>
							Set your default currency setting here for transactions.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CurrencyCombobox />
					</CardContent>
				</Card>
				<CategoryList type='income' />
				<CategoryList type='expense' />
			</div>
		</div>
	)
}

const CategoryList = ({ type }: { type: string }) => {
	const categoryQuery = useQuery({
		queryKey: ['manage', 'category', type],
		queryFn: () =>
			fetch(`/api/categories?type=${type}`).then((resp) => resp.json()),
	})

	const hasData = categoryQuery.data && categoryQuery.data.length > 0

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className='flex gap-4 flex-wrap items-center justify-between'>
						<div className='flex gap-4'>
							{type === 'expense' ? (
								<TrendingDownIcon className='h-12 w-12 bg-red-400/10 text-red-500 p-2 rounded-lg' />
							) : (
								<TrendingUpIcon className='h-12 w-12 bg-emerald-400/10 text-emerald-500 p-2 rounded-lg' />
							)}
							<div className=''>
								<h2 className='text-2xl md:text-3xl font-bold font-mono'>
									{type === 'expense' ? 'Expenses' : 'Incomes'} Categories
								</h2>
								<small className='text-muted-foreground'>Sorted By Name</small>
							</div>
						</div>
						<div className='ml-auto'>
							<CreateCategoryPopup type={type as TransactionType} />
						</div>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{hasData ? (
					<div className='grid grid-flow-row gap-4 md:grid-cols-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'>
						{categoryQuery.data.map((category: Category) => (
							<SkeletonWrapper isLoading={categoryQuery.isFetching}>
								<CategoryCard category={category} />
							</SkeletonWrapper>
						))}
					</div>
				) : (
					<div className='flex'>
						<p>No categories in this section yet, please create one.</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

const CategoryCard = ({ category }: { category: Category }) => {
	return (
		<div className='flex border-separate flex-col items-center rounded-md border shadow-md p-1'>
			<div className='grid place-content-center p-4 gap-1'>
				<span className='text-3xl text-center'>{category.icon}</span>
				<p className='text-xl font-bold font-mono text-center'>
					{category.name}
				</p>
			</div>
			<DeleteCategoryPopup
				category={category}
				trigger={
					<Button
						variant={'destructive'}
						className='flex items-center justify-center w-full cursor-pointer rounded-t-none'>
						<TrashIcon />
						Delete
					</Button>
				}
			/>
		</div>
	)
}

export default Page
