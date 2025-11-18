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
import { TransactionType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Category } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import CreateCategoryPopup from './CreateCategoryPopup'

interface Props {
	type: TransactionType
	onChange: (fieldData: string) => void
}

const CategoryPicker = ({ type, onChange }: Props) => {
	const [open, setOpen] = useState(false)
	const [category, setCategory] = useState('')

	useEffect(() => {
		if (!category) return
		onChange(category)
	}, [onChange, category])

	const categories = useQuery({
		queryKey: ['categories', type],
		queryFn: () =>
			fetch(`/api/categories?type=${type}`).then((res) => res.json()),
	})
	const selectedCategory = categories.data?.find(
		(cat: Category) => cat.name === category
	)
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					role='combobox'
					aria-expanded={open}
					className=''
					variant='outline'>
					{selectedCategory ? (
						<CategoryRow category={selectedCategory} />
					) : (
						'Select a category'
					)}
					<ChevronDown />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full'>
				<Command
					onSubmit={(e) => {
						e.preventDefault()
					}}>
					<CommandInput placeholder='Search category...' />
					<CommandEmpty>
						<p>Category not found</p>
						<p>Tip: Create a new category</p>
					</CommandEmpty>
					<CommandGroup>
						<CommandList>
							{categories.data?.map((cat: Category) => (
								<CommandItem
									key={cat.name}
									onSelect={(currentOption) => {
										setCategory(cat.name)
										setOpen((lastState) => !lastState)
									}}>
									<CategoryRow category={cat} />
									<Check
										className={cn(category !== cat.name && 'hidden')}
									/>
								</CommandItem>
							))}
						</CommandList>
					</CommandGroup>
					<CreateCategoryPopup type={type} />
				</Command>
			</PopoverContent>
		</Popover>
	)
}

const CategoryRow = ({ category }: { category: Category }) => {
	return (
		<li className='flex items-center gap-4 cursor-pointer'>
			<span role='img'>{category.icon}</span>
			<span className='text-sm font-bold font-mono'>{category.name}</span>
		</li>
	)
}
export default CategoryPicker
