'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useMutation, useQuery } from '@tanstack/react-query'
import SkeletonWrapper from './SkeletonWrapper'
import { UserSettings } from '@prisma/client'
import { UpdateUserCurrency } from '@/app/wizard/_actions/userSettings'
import { toast } from 'sonner'

export const CURRENCIES = [
	{
		code: 'INR',
		label: '₹ Indian Rupees',
		locale: 'en-IN',
	},
	{
		code: 'GBP',
		label: '£ Pound',
		locale: 'en-GB',
	},
	{
		code: 'USD',
		label: '$ Dollar',
		locale: 'en-US',
	},
	{
		code: 'EUR',
		label: '€ Euro',
		locale: 'de-DE',
	},
	{
		code: 'JPY',
		label: '¥ Yen',
		locale: 'ja-JP',
	},
]

export function CurrencyCombobox() {
	const [open, setOpen] = React.useState(false)
	const [option, setOption] = React.useState<(typeof CURRENCIES)[0] | null>(
		null
	)

	const userSettings = useQuery<UserSettings>({
		queryKey: ['user-settings'],
		queryFn: () => fetch('/api/user-settings').then((res) => res.json()),
	})

	React.useEffect(() => {
		if (!userSettings) return
		if (userSettings.data?.currency)
			setOption(
				CURRENCIES.find(
					(currency) => currency.code === userSettings.data.currency
				)!
			)
	}, [userSettings.data])

	const mutation = useMutation({
		mutationFn: UpdateUserCurrency,
		onSuccess: (data: UserSettings) => {
			toast.success('Updated successfully...', {
				id: 'update-currency',
			})
			setOption(CURRENCIES.find((currency) => currency.code === data.currency)!)
			setOpen(false)
		},
		onError: (e) => toast.error(e.message, { id: 'update-currency' }),
	})

	const handleOptionChange = (currentOption: string) => {
		const currencyOption = CURRENCIES.find(
			(currency) => currency.code === currentOption
		)!

		if (!currentOption) {
			toast.error('Please select a currency...')
			return
		}
		toast.loading('Updating currency...', {
			id: 'update-currency',
		})

		mutation.mutate(currencyOption)
	}

	return (
		<SkeletonWrapper isLoading={userSettings.isFetching}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='w-full justify-between'>
						{option
							? CURRENCIES.find((currency) => currency.code === option.code)
									?.label
							: 'Select currency...'}
						<ChevronsUpDown className='opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[300px] p-0'>
					<Command>
						<CommandInput placeholder='Search currency...' className='h-9' />
						<CommandList>
							<CommandEmpty>No currency found.</CommandEmpty>
							<CommandGroup>
								{CURRENCIES.map((currency) => (
									<CommandItem
										key={currency.code}
										value={currency.code}
										onSelect={handleOptionChange}>
										{currency.label}
										<Check
											className={cn(
												'ml-auto',
												option?.code === currency.code
													? 'opacity-100'
													: 'opacity-0'
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</SkeletonWrapper>
	)
}
