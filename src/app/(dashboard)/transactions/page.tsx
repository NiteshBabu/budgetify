'use client'

import { DateRangePicker } from '@/components/ui/date-range-picker'
import { MAX_DATE_RANGE } from '@/lib/constants'
import { differenceInDays, startOfMonth } from 'date-fns'
import { useState } from 'react'
import { toast } from 'sonner'
import TransactionsTable from './_components/TransactionsTable'

export default function Page() {
	const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
		from: startOfMonth(new Date()),
		to: new Date(),
	})
	return (
		<div className='grid gap-5'>
			<div className='border-b bg-card'>
				<div className='container mx-auto flex md:flex-row flex-col md:items-center justify-between gap-5 py-10'>
					<div className=''>
						<h1 className='text-3xl md:text-5xl font-bold font-mono'>
							Transactions
						</h1>
						<p className='text-muted-foreground'>
							Manage your transactions here.
						</p>
					</div>

					<div className='ml-auto'>
						<DateRangePicker
							initialDateFrom={dateRange.from}
							initialDateTo={dateRange.to}
							showCompare={false}
							onUpdate={(date) => {
								const { from, to } = date.range
								if (!from || !to) return
								if (differenceInDays(to, from) > MAX_DATE_RANGE)
									toast.error('Please select date range less than 90 days')

								setDateRange({
									from,
									to,
								})
							}}
						/>
					</div>
				</div>
			</div>
			<div className='container mx-auto'>
				<TransactionsTable from={dateRange.from} to={dateRange.to} />
			</div>
		</div>
	)
}
