import Logo from '@/components/Logo'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='relative h-screen w-full grid place-content-center gap-8'>
      <Logo />
			{children}
		</div>
	)
}
