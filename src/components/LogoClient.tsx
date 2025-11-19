import { useQuery } from '@tanstack/react-query'
import {
	BadgeDollarSignIcon,
	BadgeEuroIcon,
	BadgeIndianRupeeIcon,
	BadgeJapaneseYenIcon,
	BadgePoundSterlingIcon,
} from 'lucide-react'
import { ReactNode } from 'react'
import SkeletonWrapper from './SkeletonWrapper'

const LogoClient = ({ withoutText }: { withoutText?: boolean }) => {
	const userSettingsQuery = useQuery({
		queryKey: ['user-settings'],
		queryFn: () => fetch('/api/user-settings').then((resp) => resp.json()),
	})

	let logo: ReactNode = (
		<BadgeDollarSignIcon className=' h-11 w-11 text-lime-500 font-bold' />
	)

	switch (userSettingsQuery.data?.currency) {
		case 'JPY':
			logo = (
				<BadgeJapaneseYenIcon className=' h-11 w-11 text-lime-500 font-bold' />
			)
			break
		case 'INR':
			logo = (
				<BadgeIndianRupeeIcon className=' h-11 w-11 text-lime-500 font-bold' />
			)
			break
		case 'GBP':
			logo = (
				<BadgePoundSterlingIcon className=' h-11 w-11 text-lime-500 font-bold' />
			)
			break
		case 'EUR':
			logo = <BadgeEuroIcon className=' h-11 w-11 text-lime-500 font-bold' />
			break
	}

	if (withoutText)
		return (
			<SkeletonWrapper isLoading={userSettingsQuery.isFetching}>
				{logo}
			</SkeletonWrapper>
		)
	return (
		<a href='/' className='flex gap-2 items-center justify-center'>
			<SkeletonWrapper isLoading={userSettingsQuery.isLoading}>
				{logo}
			</SkeletonWrapper>
			<p className='text-colorful font-mono leading-tight tracking-tighter font-bold text-2xl'>
				Budgetify
			</p>
		</a>
	)
}

export default LogoClient
