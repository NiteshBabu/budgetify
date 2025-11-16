import type { Metadata } from 'next'
import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import RootProvider from '@/components/providers/RootProvider'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Budgetify',
	description: 'Track your finances, the right way!',
}

export default function RootLayout({
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
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					
					<RootProvider>{children}</RootProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
