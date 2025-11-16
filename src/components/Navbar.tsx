'use client'
import { cn } from '@/lib/utils'
import Logo from './Logo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button, buttonVariants } from './ui/button'
import { UserButton } from '@clerk/nextjs'
import { ToggleThemeButton } from './ToggleThemeButton'
import { SetStateAction, useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Menu } from 'lucide-react'

const LINKS = [
	{ label: 'Dashboard', href: '/' },
	{ label: 'Expense', href: '/expense' },
	{ label: 'Income', href: '/income' },
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
					<SheetTrigger asChild>
						<Button size='icon'>
							<Menu />
						</Button>
					</SheetTrigger>
					<SheetContent
						className='w-[400px] sm:[540px] flex flex-col'
						side='left'>
						<Logo />
						<div className='flex flex-col justify-between h-full'>
							<ul className='flex gap-4 flex-col items-start font-bold font-mono'>
								{LINKS.map((link) => (
									<LinkItem
										{...link}
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
		<div className='hidden md:block border-separate bg-background border-b'>
			<nav className='container flex gap-4 justify-between items-center'>
				<div className='logo'>
					<Logo />
				</div>
				<ul className='flex gap-4 items-center font-bold font-mono'>
					{LINKS.map((link) => (
						<LinkItem {...link} />
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
					'w-full justify-start text-lg text-muted-foreground hover:text-foreground relative',
					isCurrent &&
						'text-foreground  after:content-[""]  after:absolute after:-bottom-0.5 after:w-full after:h-0.5 after:bg-foreground after:left-0'
				)}
				onClick={clickCallback && clickCallback}
				>
				{label}
			</Link>
		</li>
	)
}
