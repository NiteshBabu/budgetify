import { AlertDescription } from '@/components/ui/alert'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { TransactionType } from '@/lib/types'
import { Category } from '@prisma/client'
import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { toast } from 'sonner'
import { DeleteCategory } from '../../_actions/categories'

interface Props {
	trigger: ReactNode
	category: Category
}

function DeleteCategoryPopup({ trigger, category }: Props) {
	const queryClient = useQueryClient()
	const categoryIdentifier = `${category.name}-${category.type}`

	const deleteCategoryQuery = useMutation({
		mutationFn: DeleteCategory,
		onError: (e) => {
			toast.error(e.message, {
				id: categoryIdentifier,
			})
		},
		onSuccess: async () => {
			toast.success(`${category.name} category deleted successfully!`, {
        id: categoryIdentifier
      })
			await queryClient.invalidateQueries({
				queryKey: ['manage', 'category'],
			})
		},
	})
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						You sure wanna delete this category?
					</AlertDialogTitle>
					<AlertDescription>
						This action can't be undone & will permanently delete this category
					</AlertDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							toast.loading('Deleting category...', {
                id: categoryIdentifier
              })
							deleteCategoryQuery.mutate({
								name: category.name,
								type: category.type as TransactionType,
							})
						}}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default DeleteCategoryPopup
