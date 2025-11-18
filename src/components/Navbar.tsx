'use client'
import { cn } from '@/lib/utils'
import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Logo from './Logo'
import { ToggleThemeButton } from './ToggleThemeButton'
import { Button, buttonVariants } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

const LINKS = [
	{ label: 'Dashboard', href: '/' },
	{ label: 'Transactions', href: '/transactions' },
	{ label: 'Manage', href: '/manage' },
]
export const Navbar = () => {
	return (
		<>
			<DesktopNavbar />
			<MobileNavbar />
		</>
	)
}

export const MobileNavbar = () => {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<div className='md:hidden border-separate bg-background border-b'>
			<nav className=''>
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<div className='flex items-center justify-between py-3'>
						<SheetTrigger asChild>
							<Button size={'icon'} variant='outline'>
								<Menu />
							</Button>
						</SheetTrigger>
						<Logo />
					</div>
					<SheetContent
						className='w-[400px] sm:[540px] flex flex-col py-4'
						side='left'>
						<div className='flex border-b pb-4 px-3'>
							<Logo />
						</div>
						<div className='flex flex-col justify-between h-full'>
							<ul className='flex gap-4 flex-col items-start font-bold font-mono'>
								{LINKS.map((link, index) => (
									<LinkItem
										{...link}
										key={index}
										clickCallback={() => setIsOpen((lastState) => !lastState)}
									/>
								))}
							</ul>
							<div className='flex justify-end gap-4 m-5'>
								<ToggleThemeButton />
								<UserButton afterSignOutUrl='/sign-in' />
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</nav>
		</div>
	)
}
export const DesktopNavbar = () => {
	return (
		<div className='hidden md:block border-separate bg-background '>
			<nav className='flex gap-4 justify-between items-center'>
				<div className='logo py-4'>
					<Logo />
				</div>
				<ul className='flex gap-5 items-center font-bold font-mono'>
					{LINKS.map((link, index) => (
						<LinkItem {...link} key={index} />
					))}
					<ToggleThemeButton />
					<UserButton afterSignOutUrl='/sign-in' />
				</ul>
			</nav>
		</div>
	)
}

function LinkItem({
	label,
	href,
	clickCallback,
}: {
	label: string
	href: string
	clickCallback?: () => void
}) {
	const pathname = usePathname()
	const isCurrent = pathname === href

	return (
		<li>
			<Link
				href={href}
				className={cn(
					buttonVariants({
						variant: 'ghost',
					}),
					'w-full justify-start px-1 text-lg text-muted-foreground hover:text-foreground relative',
					isCurrent &&
						'text-foreground  after:content-[""]  after:absolute after:-bottom-5 after:w-full after:h-0.5 after:bg-emerald-500 after:left-0'
				)}
				onClick={clickCallback && clickCallback}>
				{label}
			</Link>
		</li>
	)
}
