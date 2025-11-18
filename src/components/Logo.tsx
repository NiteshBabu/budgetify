import { PiggyBank } from 'lucide-react'

const Logo = () => {
	return (
		<a href='/' className='flex gap-2 items-center justify-center'>
			<PiggyBank className='stroke stroke-[1.5] h-11 w-11 text-green-600' />
			<p className='text-colorful font-mono leading-tight tracking-tighter font-bold text-2xl'>
				Budgetify
			</p>
		</a>
	)
}

export default Logo
