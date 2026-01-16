import RootProvider from '@/components/providers/RootProvider'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
	title: 'Budgetify',
	description: 'Track your finances, the right way!',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html
				lang='en'
				className='dark'
				style={{
					colorScheme: 'dark',
				}}>
				<body className={`font-mono antialiased`}>
					<Toaster richColors position='bottom-right' />
					<RootProvider>{children}</RootProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
