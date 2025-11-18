import { Navbar } from '@/components/Navbar'

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className='flex min-h-screen flex-col w-full'>
			<div className='border-b'>
				<div className='container mx-auto'>
					<Navbar />
				</div>
			</div>
			<div className='w-full'>{children}</div>
		</div>
	)
}
