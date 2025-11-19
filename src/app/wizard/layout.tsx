import Logo from "@/components/Logo"

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className='grid place-content-center w-full gap-5 h-screen'>
			<Logo />
			{children}
		</div>
	)
}
