'use client'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { TransactionType } from '@/lib/types'
import { cn, DateToUTCDate } from '@/lib/utils'
import {
	CreateTransactionSchema,
	CreateTransactionSchemaType,
} from '@/schema/transaction'
import { ReactNode, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import CategoryPicker from './CategoryPicker'
import { Button } from '@/components/ui/button'
import { CalendarIcon, MinusIcon, PlusIcon } from 'lucide-react'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateTransaction } from '../_actions/transaction'
import { toast } from 'sonner'

interface Props {
	trigger: ReactNode
	type: TransactionType
}

const CreateTransactionsPopup = ({ trigger, type }: Props) => {
	const [open, setOpen] = useState(false)
	const form = useForm<CreateTransactionSchemaType>({
		resolver: zodResolver(CreateTransactionSchema),
		defaultValues: {
			type,
			date: new Date(),
		},
	})

	const queryClient = useQueryClient()

	const { mutate, isPending } = useMutation({
		mutationFn: CreateTransaction,
		onSuccess: () => {
			toast.success('Created successfully', {
				id: 'create-transaction',
			})
			form.reset()
			queryClient.invalidateQueries({
				queryKey: ['insight'],
			})
			setOpen((lastState) => !lastState)
		},
		onError: (e) => {
			toast.error(e.message, {
				id: 'create-transaction',
			})
		},
	})

	const onSubmit = useCallback(
		(formData: CreateTransactionSchemaType) => {
			toast.loading('Creating transaction...', {
				id: 'create-transaction',
			})
			mutate({
				...formData,
				date: DateToUTCDate(formData.date),
			})
		},
		[mutate]
	)
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='mb-4'>
						Create New{' '}
						<span
							className={cn(
								type === 'income' ? 'text-emerald-500' : 'text-red-500',
								'font-bold tracking-wide'
							)}>
							{type.toUpperCase()}
						</span>
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input defaultValue={''} {...field} />
									</FormControl>
									<FormDescription>
										Transaction description (optional)
									</FormDescription>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='amount'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount</FormLabel>
									<FormControl>
										<Input defaultValue={0} type='number' {...field} />
									</FormControl>
									<FormDescription>
										Transaction amount (required)
									</FormDescription>
								</FormItem>
							)}
						/>
						{/* Category : {form.watch('category')} */}
						<div className='flex md:flex-row flex-col items-start gap-4'>
							<FormField
								control={form.control}
								name='category'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel>Category</FormLabel>
										<FormControl>
											<CategoryPicker type={type} onChange={field.onChange} />
										</FormControl>
										<FormDescription>
											Select category for this transaction
										</FormDescription>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='date'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel>Transaction Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button variant='outline'>
														{field.value && format(field.value, 'PPP')}
														<CalendarIcon />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent>
												<Calendar
													mode='single'
													selected={field.value}
													onSelect={field.onChange}
												/>
											</PopoverContent>
										</Popover>
										<FormDescription>
											Select date for this transaction
										</FormDescription>
									</FormItem>
								)}
							/>
						</div>
					</form>
				</Form>
				<DialogFooter>
					<Button
						onClick={form.handleSubmit(onSubmit)}
						className={cn(
							type === 'income'
								? 'bg-emerald-500 hover:bg-emerald-700'
								: 'bg-red-500 hover:bg-red-700',
							'text-white cursor-pointer'
						)}>
						{type === 'income' ? <PlusIcon /> : <MinusIcon />}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default CreateTransactionsPopup
