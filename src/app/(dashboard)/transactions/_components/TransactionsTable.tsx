import { GetTransactionHistoryResponseType } from '@/app/api/transaction/history/route'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableViewOptions } from '@/components/data-table/column-toggle'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { DataTablePagination } from '@/components/data-table/pagination'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn, DateToUTCDate } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { download, generateCsv, mkConfig } from 'export-to-csv'
import {
  DownloadIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import DeleteTransactionPopup from './DeleteTransactionPopup'

interface Props {
	from: Date
	to: Date
}

type TransactionHistoryRow = GetTransactionHistoryResponseType[0]

export const columns: ColumnDef<TransactionHistoryRow>[] = [
	{
		accessorKey: 'category',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Category' />
		),
		cell: ({ row }) => (
			<div className='flex gap-2'>
				{row.original.categoryIcon}
				<div className='capitalize font-bold'>{row.original.category}</div>
			</div>
		),
		filterFn: (row, id, data) => data.includes(row.getValue(id)),
	},
	{
		accessorKey: 'description',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Description' />
		),
		cell: ({ row }) => (
			<div className='font-bold'>{row.original.description}</div>
		),
	},
	{
		accessorKey: 'date',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Date' />
		),
		cell: ({ row }) => {
			const date = new Date(row.original.date)
			const formattedDate = date.toLocaleDateString('default', {
				timeZone: 'UTC',
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			})

			return (
				<div className='text-muted-foreground font-bold'>{formattedDate}</div>
			)
		},
	},

	{
		accessorKey: 'amount',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Amount' />
		),
		cell: ({ row }) => <div className='font-bold'>{row.original.amount}</div>,
	},
	{
		accessorKey: 'type',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Type' />
		),
		cell: ({ row }) => (
			<div
				className={cn(
					'flex justify-center capitalize font-bold text-xs font-mono p-1 rounded-sm',
					row.original.type === 'expense'
						? 'bg-red-400/10 text-red-500'
						: 'bg-emerald-400/10 text-emerald-500'
				)}>
				{row.original.type}
			</div>
		),
	},
	{
		accessorKey: 'Update/Delete',
		cell: ({ row }) => <RowUpdateDelete row={row.original} />,
	},
]

const csvConfig = mkConfig({
	fieldSeparator: ',',
	decimalSeparator: '.',
	useKeysAsHeaders: true,
})

function TransactionsTable({ from, to }: Props) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const transactionsQuery = useQuery({
		queryKey: ['transaction'],
		queryFn: () =>
			fetch(
				`/api/transaction/history?from=${DateToUTCDate(
					from
				)}&to=${DateToUTCDate(to)}`
			).then((resp) => resp.json()),
	})

	const handleExport = (data: any[]) => {
		if (data.length <= 0) return
		const csvFile = generateCsv(csvConfig)(data)
		download(csvConfig)(csvFile)
	}

	const table = useReactTable({
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
		data: transactionsQuery.data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			sorting,
			columnFilters,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	})

	const categoryOptions = useMemo(() => {
		const categoryMap = new Map()

		transactionsQuery.data?.forEach((transaction) => {
			categoryMap.set(transaction.category, {
				label: `${transaction.categoryIcon}-${transaction.category}`,
				value: transaction.category,
			})
		})

		const uniqueCategories = new Set(categoryMap.values())

		return Array.from(uniqueCategories)
	}, [transactionsQuery.data])
	return (
		<>
			<div className='flex flex-wrap gap-5 mb-5'>
				{table.getColumn('category') && (
					<DataTableFacetedFilter
						title='Category'
						column={table.getColumn('category')}
						options={categoryOptions}
					/>
				)}
				{table.getColumn('type') && (
					<DataTableFacetedFilter
						title='Type'
						column={table.getColumn('type')}
						options={[
							{ label: 'Income', value: 'income' },
							{ label: 'Expense', value: 'expense' },
						]}
					/>
				)}
				<Button
					variant='outline'
					onClick={() => {
						const data = table.getFilteredRowModel().rows.map((row) => ({
							category: row.original.category,
							description: row.original.description,
							amount: row.original.amount,
							type: row.original.type,
							date: row.original.date,
						}))

						handleExport(data)
					}}
					disabled={table.getFilteredRowModel().rows.length <= 0}>
					<DownloadIcon />
					Export
				</Button>
				<DataTableViewOptions table={table} />
			</div>
			<div className='overflow-hidden rounded-md border'>
				<SkeletonWrapper isLoading={transactionsQuery.isFetching} fullWidth>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</TableHead>
										)
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className='h-24 text-center'>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</SkeletonWrapper>
			</div>
			<div className='my-5'>
				<DataTablePagination table={table} />
			</div>
		</>
	)
}

const RowUpdateDelete = ({ row }: { row: TransactionHistoryRow }) => {
	const [showDialog, setShowDialog] = useState(false)

	return (
		<>
			<DeleteTransactionPopup
				open={showDialog}
				setOpen={setShowDialog}
				transactionId={row.id}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className='' size={'sm'} variant={'ghost'}>
						<span className='sr-only'>Open Menu</span>
						<MoreHorizontalIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Delete/Update</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onSelect={() => {
							setShowDialog((lastState) => !lastState)
						}}>
						<TrashIcon /> Delete
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={() => {
							alert('Coming Soon!')
						}}>
						<EditIcon /> Update
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}

export default TransactionsTable
