import Footer from '@/components/Footer'
import { Navbar } from '@/components/Navbar'

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {


	return (
		<div className='grid grid-rows-[auto_1fr_auto] min-h-screen'>
			<div className='border-b'>
				<div className='container mx-auto'>
					<Navbar />
				</div>
			</div>
			<div className='w-full'>{children}</div>
			<Footer />
		</div>
	)
}
