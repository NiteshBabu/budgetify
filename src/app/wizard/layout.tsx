import Logo from '@/components/Logo'

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className='grid place-content-center w-full h-screen gap-5'>
			{children}
			<Logo />
		</div>
	)
}
