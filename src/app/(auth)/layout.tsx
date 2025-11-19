import Logo from '@/components/Logo'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='w-full grid place-content-center justify-items-center h-screen gap-5'>
			<Logo />
			{children}
		</div>
	)
}
