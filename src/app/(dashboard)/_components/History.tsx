'use client'

import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PeriodType, TimeframeType } from '@/lib/types'
import { cn, GetCurrencyFormatter } from '@/lib/utils'
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import CountUp from 'react-countup'
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import HistoryPeriodSelector from './HistoryPeriodSelector'

type Props = {
	userSettings: UserSettings
}
function History({ userSettings }: Props) {
	const [timeframe, setTimeframe] = useState<TimeframeType>('month')
	const [period, setPeriod] = useState<PeriodType>({
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	})

	const formatter = useMemo(
		() => GetCurrencyFormatter(userSettings.currency),
		[userSettings.currency]
	)

	const historyDataQuery = useQuery({
		queryKey: ['dashboard', 'history', timeframe],
		queryFn: () =>
			fetch(
				`/api/history-data?timeframe=${timeframe}&month=${period.month}&year=${period.year}`
			).then((resp) => resp.json()),
	})
	console.log(historyDataQuery.data)
	return (
		<div className='grid'>
			<Card>
				<CardHeader>
					<CardTitle className='flex md:flex-row flex-col gap-4 justify-between'>
						<HistoryPeriodSelector
							period={period}
							setPeriod={setPeriod}
							timeframe={timeframe}
							setTimeframe={setTimeframe}
						/>
						<div className='flex gap-2 items-center'>
							<Badge className='p-1 px-3 font-mono font-bold' variant='outline'>
								<span className='bg-emerald-500 h-3 w-3 rounded-full'></span>
								Income
							</Badge>
							<Badge className='p-1 px-3 font-mono font-bold' variant='outline'>
								<span className='bg-red-500 h-3 w-3 rounded-full'></span>
								Expense
							</Badge>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<SkeletonWrapper isLoading={historyDataQuery.isFetching}>
						{historyDataQuery.data ? (
							<ResponsiveContainer width='100%' height={300}>
								<BarChart
									height={300}
									data={historyDataQuery.data}
									barCategoryGap={5}>
									<defs>
										<linearGradient
											id='incomeBar'
											x1={'0'}
											y1={'0'}
											x2={'0'}
											y2={'1'}>
											<stop
												offset={'0'}
												stopColor='#10b981'
												stopOpacity={'1'}
											/>
											<stop
												offset={'1'}
												stopColor='#10b981'
												stopOpacity={'0'}
											/>
										</linearGradient>
										<linearGradient
											id='expenseBar'
											x1={'0'}
											y1={'0'}
											x2={'0'}
											y2={'1'}>
											<stop
												offset={'0'}
												stopColor='#ef4444'
												stopOpacity={'1'}
											/>
											<stop
												offset={'1'}
												stopColor='#ef4444'
												stopOpacity={'0'}
											/>
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray={'5  5 '}
										stopOpacity={'0.1'}
										vertical={false}
									/>
									<XAxis
										stroke='#888888'
										fontSize={'12'}
										tickLine={false}
										axisLine={false}
										padding={{
											left: 5,
											right: 5,
										}}
										dataKey={(data) => {
											const { year, month, day } = data
											const date = new Date(year, month, day || 1)
											if (timeframe === 'year') {
												return date.toLocaleDateString('default', {
													month: 'long',
												})
											}
											return date.toLocaleDateString('default', {
												day: '2-digit',
											})
										}}
									/>
									<YAxis
										stroke='#888888'
										fontSize={13}
										tickLine={false}
										axisLine={false}
									/>
									<Bar
										dataKey='income'
										fill='url(#incomeBar)'
										label='Income'
										radius={5}
										className='cursor-pointer'
									/>
									<Bar
										dataKey='expense'
										fill='url(#expenseBar)'
										label='Expense'
										radius={5}
										className='cursor-pointer'
									/>
									<Tooltip
										cursor={{
											opacity: 0.1,
										}}
										content={(props) => (
											<CustomTooltip formatter={formatter} {...props} />
										)}
									/>
								</BarChart>
							</ResponsiveContainer>
						) : (
							<Card className='flex items-center justify-center h-[300px]'>
								<CardTitle>No data for the selected period</CardTitle>
								<p>Please change the time period</p>
							</Card>
						)}
					</SkeletonWrapper>
				</CardContent>
			</Card>
		</div>
	)
}

export default History

const CustomTooltip = ({ formatter, active, payload }: any) => {
	if (!active || !payload || payload.length <= 0) return null

	const data = payload[0].payload
	const { income, expense } = data

	return (
		<div className='min-w-[300px] rounded border bg-background p-3'>
			<TooltipRow
				formatter={formatter}
				label='Income'
				data={income}
				bgColor='bg-emerald-500'
				textColor='text-emerald-500'
			/>
			<TooltipRow
				formatter={formatter}
				label='Expense'
				data={expense}
				bgColor='bg-red-500'
				textColor='text-red-500'
			/>
			<TooltipRow
				formatter={formatter}
				label='Balance'
				data={income - expense}
				bgColor='bg-gray-100'
				textColor='text-gray-100'
			/>
		</div>
	)
}

const TooltipRow = ({
	formatter,
	label,
	data,
	bgColor,
	textColor,
}: {
	formatter: Intl.NumberFormat
	label: string
	bgColor: string
	textColor: string
	data: number
}) => {

	const formatFn = useCallback(formatter.format, [formatter])
	return (
		<div className='flex items-center justify-between gap-4 py-1'>
			<div className='flex gap-2 items-center'>
				<span className={cn('h-3 w-3 rounded-full', bgColor)}></span>
				<p className='font-mono font-bold text-xs'>{label}</p>
			</div>
			<CountUp
				preserveValue
				end={data}
				duration={0.5}
				decimalPlaces={0}
				formattingFn={formatFn}
				className={cn('text-xs font-bold font-mono', textColor)}
			/>
		</div>
	)
}
