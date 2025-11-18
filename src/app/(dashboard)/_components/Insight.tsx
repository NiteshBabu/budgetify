'use client'

import { DateRangePicker } from '@/components/ui/date-range-picker'
import { MAX_DATE_RANGE } from '@/lib/constants'
import { UserSettings } from '@prisma/client'
import { differenceInDays, startOfMonth } from 'date-fns'
import { useState } from 'react'
import { toast } from 'sonner'
import Stats from './Stats'

type Prop = {
	userSettings: UserSettings
}

function Insight({ userSettings }: Prop) {
	const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
		from: startOfMonth(new Date()),
		to: new Date(),
	})
	return (
		<div className='grid gap-5 '>
			<div className='flex justify-between items-center '>
				<h2 className='text-2xl md:text-3xl font-bold font-mono'>Insight</h2>
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
			<Stats
				userSettings={userSettings}
				from={dateRange.from}
				to={dateRange.to}
			/>
		</div>
	)
}

export default Insight
