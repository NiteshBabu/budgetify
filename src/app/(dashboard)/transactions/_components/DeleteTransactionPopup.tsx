import { AlertDescription } from '@/components/ui/alert'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { DeleteTransaction } from '../_actions/deleteTransaction'

interface Props {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
	transactionId: string
}
function DeleteTransactionPopup({ open, setOpen, transactionId }: Props) {
	const queryClient = useQueryClient()

	const deleteTransactionQuery = useMutation({
		mutationFn: DeleteTransaction,
		onError: (e) => {
			toast.error(e.message, {
				id: transactionId,
			})
		},
		onSuccess: async () => {
			toast.success(`Transaction deleted successfully!`, {
				id: transactionId,
			})
			await queryClient.invalidateQueries({
				queryKey: ['transaction'],
			})
		},
	})
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
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
								id: transactionId,
							})
							deleteTransactionQuery.mutate(transactionId)
						}}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default DeleteTransactionPopup
