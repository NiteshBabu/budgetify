import {Navbar} from '@/components/Navbar'

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className='relative flex h-screen flex-col w-full'>
			<Navbar />
			<div className='w-full'>{children}</div>
		</div>
	)
}
