import { GetHistoryPeriodsResponseType } from '@/app/api/history-periods/route'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PeriodType, TimeframeType } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'

interface Props {
	timeframe: TimeframeType
	period: PeriodType
	setTimeframe: Dispatch<SetStateAction<TimeframeType>>
	setPeriod: Dispatch<SetStateAction<PeriodType>>
}

function HistoryPeriodSelector({
	timeframe,
	setTimeframe,
	period,
	setPeriod,
}: Props) {
	const historyPeriods = useQuery({
		queryKey: ['dashboard', 'history', 'periods'],
		queryFn: () => fetch('/api/history-periods').then((resp) => resp.json()),
	})
	return (
		<div className='flex gap-4 flex-wrap'>
			<SkeletonWrapper isLoading={historyPeriods.isFetching}>
				<Tabs
					value={timeframe}
					onValueChange={(data) => setTimeframe(data as TimeframeType)}>
					<TabsList>
						<TabsTrigger value='year'>Year</TabsTrigger>
						<TabsTrigger value='month'>Month</TabsTrigger>
					</TabsList>
				</Tabs>
			</SkeletonWrapper>
			<SkeletonWrapper isLoading={historyPeriods.isFetching}>
				<YearSelector
					period={period}
					setPeriod={setPeriod}
					years={historyPeriods.data || []}
				/>
			</SkeletonWrapper>
			{timeframe === 'month' && (
				<SkeletonWrapper isLoading={historyPeriods.isFetching}>
					<MonthSelector period={period} setPeriod={setPeriod} />
				</SkeletonWrapper>
			)}
		</div>
	)
}

const YearSelector = ({
	period,
	setPeriod,
	years,
}: {
	period: PeriodType
	setPeriod: Dispatch<SetStateAction<PeriodType>>
	years: GetHistoryPeriodsResponseType
}) => {
	return (
		<Select
			value={period.year.toString()}
			onValueChange={(data) => {
				setPeriod({
					month: period.month,
					year: parseInt(data),
				})
			}}>
			<SelectTrigger className='w-[130px]'>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{years.map((year) => (
					<SelectItem key={year} value={year.toString()}>
						{year}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
const MonthSelector = ({
	period,
	setPeriod,
}: {
	period: PeriodType
	setPeriod: Dispatch<SetStateAction<PeriodType>>
}) => {
	return (
		<Select
			value={period.month.toString()}
			onValueChange={(data) => {
				setPeriod({
					month: parseInt(data),
					year: period.year,
				})
			}}>
			<SelectTrigger className='w-[130px]'>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => (
					<SelectItem key={month} value={month.toString()}>
						{new Date(period.year, month, 1).toLocaleDateString('default', {
							month: 'long',
						})}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default HistoryPeriodSelector
