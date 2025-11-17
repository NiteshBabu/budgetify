'use client'

import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Card } from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { MAX_DATE_RANGE } from '@/lib/constants'
import { cn, DateToUTCDate, GetCurrencyFormatter } from '@/lib/utils'
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { differenceInDays, startOfMonth } from 'date-fns'
import { TrendingDownIcon, TrendingUpIcon, WalletIcon } from 'lucide-react'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import CountUp from 'react-countup'
import { GetCategoryStatsResponseType } from '@/app/api/stats/category/route'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'

type Props = {
	from: Date
	to: Date
	userSettings: UserSettings
}

function Stats({ userSettings, from, to }: Props) {
	const statsQuery = useQuery<GetBalanceStatsResponseType>({
		queryKey: ['insight', 'stats', from, to],
		queryFn: () =>
			fetch(
				`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
			).then((resp) => resp.json()),
	})

	const formatter = useMemo(() => {
		return GetCurrencyFormatter(userSettings.currency)
	}, [userSettings?.currency])

	const income = statsQuery.data?.income || 0
	const expense = statsQuery.data?.expense || 0
	return (
		<div className='grid gap-5'>
			<div className='flex items-center gap-5 md:flex-row flex-col'>
				<SkeletonWrapper isLoading={statsQuery.isFetching}>
					<StatsCard formatter={formatter} data={income}>
						<p className='font-bold text-xl font-mono'>Income</p>
						<TrendingUpIcon className='text-emerald-500 bg-emerald-500/10 h-13 w-13 rounded-lg p-2' />
					</StatsCard>
				</SkeletonWrapper>
				<SkeletonWrapper isLoading={statsQuery.isFetching}>
					<StatsCard formatter={formatter} data={expense}>
						<p className='font-bold text-xl font-mono'>Expense</p>
						<TrendingDownIcon className='text-red-500 bg-red-500/10 h-13 w-13 rounded-lg p-2 ' />
					</StatsCard>
				</SkeletonWrapper>
				<SkeletonWrapper isLoading={statsQuery.isFetching}>
					<StatsCard formatter={formatter} data={income - expense}>
						<h3 className='font-bold text-xl font-mono'>Balance</h3>
						<WalletIcon className='text-indigo-500 bg-indigo-500/10 h-13 w-13 rounded-lg p-2' />
					</StatsCard>
				</SkeletonWrapper>
			</div>
			<CategoryStats formatter={formatter} from={from} to={to} />
		</div>
	)
}

const StatsCard = ({
	children,
	formatter,
	data,
}: {
	children: ReactNode
	formatter: Intl.NumberFormat
	data: number
}) => {
	const formatFn = useCallback(
		(data: number) => formatter.format(data),
		[formatter]
	)
	return (
		<Card className='w-full p-4'>
			{children}
			<CountUp
				preserveValue
				redraw={false}
				end={data}
				decimal='2'
				formattingFn={formatFn}
				className='text-3xl'
			/>
		</Card>
	)
}

const CategoryStats = ({
	formatter,
	from,
	to,
}: {
	children?: ReactNode
	formatter: Intl.NumberFormat
	from: Date
	to: Date
}) => {
	const statsQuery = useQuery<GetCategoryStatsResponseType>({
		queryKey: ['insight', 'stats', 'category', from, to],
		queryFn: () =>
			fetch(
				`/api/stats/category?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
					to
				)}`
			).then((resp) => resp.json()),
	})

	const filteredData = statsQuery.data?.reduce(
		(filtered, d) => {
			if (d.type === 'income') {
				filtered.income.items.push(d)
				filtered.income.total += d._sum.amount || 0
			} else {
				filtered.expense.items.push(d)
				filtered.expense.total += d._sum.amount || 0
			}
			return filtered
		},
		{ income: { items: [], total: 0 }, expense: { items: [], total: 0 } }
	)
	console.log(filteredData)

	const formatFn = useCallback(
		(data: number) => formatter.format(data),
		[formatter]
	)
	return (
		<div className='flex gap-5 md:flex-row flex-col'>
			{filteredData &&
				Object.keys(filteredData).map((key) => (
					<SkeletonWrapper isLoading={statsQuery.isFetching}>
						<Card className='w-full p-4'>
							<h3 className='font-mono font-bold text-xl'>{key} By Category</h3>
							<ScrollArea className='h-80 w-full p-5'>
								{filteredData[key].items.map((item) => (
									<div className='grid gap-1 mb-4'>
										<div className='flex items-center justify-between gap-4 text-xs font-mono font-bold'>
											<p>
												{item.category} (
												{((item._sum.amount * 100) / filteredData[key].total).toFixed()}%)
											</p>
											<CountUp
												preserveValue
												redraw={false}
												end={item._sum.amount!}
												formattingFn={formatFn}
												className='text-base'
											/>
										</div>
										<Progress
											title={item.category}
											className='h-4'
											indicatorClassName={cn(
												key === 'income' ? 'bg-emerald-500' : 'bg-red-500'
											)}
											value={(item._sum.amount * 100) / filteredData[key].total}
										/>
									</div>
								))}
							</ScrollArea>
						</Card>
					</SkeletonWrapper>
				))}
		</div>
	)
}
export default Stats
