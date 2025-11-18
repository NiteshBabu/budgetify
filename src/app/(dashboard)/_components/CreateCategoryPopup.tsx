'use client'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { TransactionType } from '@/lib/types'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	CreateCategorySchema,
	CreateCategorySchemaType,
} from '@/schema/category'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle, PlusIcon, PlusSquare } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CreateCategory } from '../_actions/categories'

interface Props {
	type: TransactionType
}

const CreateCategoryPopup = ({ type }: Props) => {
	const [open, setOpen] = useState(false)

	const form = useForm<CreateCategorySchemaType>({
		resolver: zodResolver(CreateCategorySchema),
		defaultValues: {
			type,
		},
	})

	const queryClient = useQueryClient()

	const { mutate, isPending } = useMutation({
		mutationFn: CreateCategory,
		onSuccess: async (data: Category) => {
			form.reset()
			toast.success(`Category ${data.name} created successfully!`, {
				id: 'create-category',
			})

			await queryClient.invalidateQueries({ queryKey: ['manage', 'category'] })
			setOpen((lastState) => !lastState)
		},
		onError: (e) => {
			toast.error(
				'Oops, something went wrong! \n Categories name should be unique.',
				{
					id: 'create-category',
				}
			)
		},
	})

	const onSubmit = useCallback(
		(formData: CreateCategorySchemaType) => {
			toast.loading('Creating category...', {
				id: 'create-category',
			})

			mutate(formData)
		},
		[mutate]
	)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' className='flex items-center justify-center cursor-pointer'>
					<PlusSquare className='h-5 w-5' />
					Create New
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='flex gap-1'>

						Create a new 
						<span
							className={cn(
								type === 'income' ? 'text-emerald-500' : 'text-red-500'
							, "capitalize")}>
							{type}
						</span>
						category
					</DialogTitle>
					<DialogDescription>
						Categories can be used to group transactions!
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input defaultValue={''} {...field} />
									</FormControl>
									<FormDescription>Category name</FormDescription>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='icon'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Icon</FormLabel>
									<FormControl>
										<Input defaultValue={''} {...field} />
									</FormControl>
									<FormDescription>
										Icon (Need to update to use an emoji picker)
									</FormDescription>
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<DialogFooter>
					<Button
						className='bg-emerald-500 text-white'
						onClick={form.handleSubmit(onSubmit)}
						disabled={isPending}>
						{!isPending ? (
							<>
								<PlusIcon />
								Create
							</>
						) : (
							<LoaderCircle className='animate-spin' />
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default CreateCategoryPopup
