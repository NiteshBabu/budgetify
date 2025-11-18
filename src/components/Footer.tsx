function Footer() {
	return (
		<footer className='border-t py-4 mt-4'>
			<div className='container mx-auto'>
				<p className='font-bold font-mono text-xl flex gap-3'>
					<span>&copy;{new Date().getFullYear()}</span>
					{'<Nitesh Babu/>'}
				</p>
			</div>
		</footer>
	)
}

export default Footer
