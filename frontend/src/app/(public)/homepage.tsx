'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import {
	MapPin,
	Camera,
	Users,
	TrendingUp,
	Shield,
	Leaf,
	AlertCircle,
	CheckCircle,
	ChevronRight,
	Menu,
	X,
} from 'lucide-react';
import Image from 'next/image';

export default function Homepage() {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [scrolled, setScrolled] = useState<boolean>(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const fadeInUp = {
		initial: { opacity: 0, y: 30 },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true },
		transition: { duration: 0.6 },
	};

	const staggerContainer = {
		initial: {},
		whileInView: {
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const features = [
		{
			icon: Camera,
			title: 'Instant Reporting',
			description:
				'Capture and report illegal dumping with just a few taps. Include photos, location, and details instantly.',
		},
		{
			icon: MapPin,
			title: 'Real-time Mapping',
			description:
				'View all reported incidents on an interactive map. Track cleanup progress and hotspot areas.',
		},
		{
			icon: Shield,
			title: 'Anonymous & Safe',
			description:
				'Report incidents safely with optional anonymity. Your privacy and security are our priority.',
		},
		{
			icon: Users,
			title: 'Community Driven',
			description:
				'Join a community of environmental advocates. Together we make our neighborhoods cleaner.',
		},
		{
			icon: CheckCircle,
			title: 'Track Progress',
			description:
				'Monitor the status of your reports and see the impact of community actions in real-time.',
		},
		{
			icon: Leaf,
			title: 'Environmental Impact',
			description:
				'Contribute to a cleaner environment. Every report helps protect our ecosystem and wildlife.',
		},
	];

	const howItWorks = [
		{
			step: '01',
			title: 'Spot the issue',
			description: 'Notice illegal dumping or littering in your area',
		},
		{
			step: '02',
			title: 'Take a photo',
			description: 'Capture clear images of the incident with your phone',
		},
		{
			step: '03',
			title: 'Submit report',
			description:
				'Fill out quick details and submit your report instantly',
		},
		{
			step: '04',
			title: 'Track & resolve',
			description: 'Monitor cleanup progress and see community impact',
		},
	];

	return (
		<main className="min-h-screen bg-background-primary">
			{/* Navigation */}
			<motion.nav
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					scrolled
						? 'bg-white/95 backdrop-blur-md shadow-md'
						: 'bg-transparent'
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16 md:h-20">
						<motion.div
							className="flex items-center space-x-2"
							whileHover={{ scale: 1.02 }}
						>
							<div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-nature rounded-lg flex items-center justify-center">
								<Leaf className="w-5 h-5 md:w-6 md:h-6 text-white" />
							</div>
							<Link
								href="/"
								className="text-xl md:text-2xl font-bold text-forest-deep"
							>
								Ecosens
							</Link>
						</motion.div>

						{/* Desktop Menu */}
						<div className="hidden md:flex items-center space-x-3">
							<Link href="/features" className="nav-link">
								Features
							</Link>
							<Link href="/help" className="nav-link">
								How It Works
							</Link>
							<Link href="/about" className="nav-link">
								About
							</Link>
							<Link href="/report">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="btn-primary"
								>
									Get Started
								</motion.button>
							</Link>
							<Link href="/login">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="btn-secondary"
								>
									Login
								</motion.button>
							</Link>
						</div>

						{/* Mobile Menu Button */}
						<button
							className="md:hidden text-forest-deep"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				<motion.div
					initial={false}
					animate={{ height: isMenuOpen ? 'auto' : 0 }}
					className="md:hidden overflow-hidden bg-white border-t border-border-light"
				>
					<div className="px-4 py-4 space-y-3">
						<Link href="/features" className="block nav-link">
							Features
						</Link>
						<Link href="/help" className="block nav-link">
							How It Works
						</Link>
						<Link href="/about" className="block nav-link">
							About
						</Link>
						<Link href="/report">
							<button className="btn-primary w-full">
								Get Started
							</button>
						</Link>
					</div>
				</motion.div>
			</motion.nav>

			{/* Hero Section */}
			<section className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-4 overflow-hidden">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
						>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
								className="inline-flex items-center space-x-2 bg-forest-light/20 text-forest-deep px-4 py-2 rounded-full text-sm font-medium mb-6"
							>
								<AlertCircle size={16} />
								<span>
									Join the fight against illegal dumping
								</span>
							</motion.div>

							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
								Clean Communities
								<span className="text-forest-mid block">
									Start With You
								</span>
							</h1>

							<p className="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed">
								Report illegal dumping and littering in your
								area. Together, we can create cleaner, healthier
								communities for everyone.
							</p>

							<div className="flex flex-col sm:flex-row gap-4">
								<Link href="/report">
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="btn-primary flex items-center justify-center space-x-2"
									>
										<span>Report Now</span>
										<ChevronRight size={20} />
									</motion.button>
								</Link>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="btn-tertiary"
								>
									Learn More
								</motion.button>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.8, delay: 0.3 }}
							className="relative"
						>
							<div className="relative bg-gradient-subtle rounded-2xl p-6 md:p-8 shadow-elevated">
								<Image
									src="/homepage.webp"
									alt="Community cleanup"
									className="rounded-xl w-full h-64 md:h-80 object-cover shadow-lg"
									loading="eager"
									width={800}
									height={600}
								/>
								<div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-elevated">
									<div className="flex items-center space-x-3">
										<div className="w-12 h-12 bg-state-success/20 rounded-full flex items-center justify-center">
											<CheckCircle
												className="text-state-success"
												size={24}
											/>
										</div>
										<div>
											<p className="text-2xl font-bold text-forest-deep">
												89%
											</p>
											<p className="text-sm text-text-secondary">
												Reports Resolved
											</p>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>

				{/* Decorative Elements */}
				<div className="absolute top-20 right-10 w-72 h-72 bg-forest-light/10 rounded-full blur-3xl -z-10"></div>
				<div className="absolute bottom-20 left-10 w-96 h-96 bg-sunlight/10 rounded-full blur-3xl -z-10"></div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-16 md:py-32 px-4">
				<div className="max-w-7xl mx-auto">
					<motion.div
						{...fadeInUp}
						className="text-center mb-12 md:mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
							Powerful Features for
							<span className="text-forest-mid block">
								Environmental Action
							</span>
						</h2>
						<p className="text-lg text-text-secondary max-w-2xl mx-auto">
							Everything you need to report, track, and resolve
							environmental issues in your community
						</p>
					</motion.div>

					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="whileInView"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
					>
						{features.map((feature, index) => (
							<motion.div
								key={index}
								variants={fadeInUp}
								whileHover={{
									y: -8,
									boxShadow:
										'0 8px 24px rgba(47, 82, 73, 0.15)',
								}}
								className="card transition-shadow duration-300"
							>
								<div className="w-12 h-12 bg-forest-mid/10 rounded-lg flex items-center justify-center mb-4">
									<feature.icon
										className="text-forest-mid"
										size={24}
									/>
								</div>
								<h3 className="text-xl font-semibold text-text-primary mb-3">
									{feature.title}
								</h3>
								<p className="text-text-secondary leading-relaxed">
									{feature.description}
								</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* How It Works Section */}
			<section
				id="how-it-works"
				className="py-16 md:py-24 px-4 bg-background-secondary"
			>
				<div className="max-w-7xl mx-auto">
					<motion.div
						{...fadeInUp}
						className="text-center mb-12 md:mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
							How Ecosens Works
						</h2>
						<p className="text-lg text-text-secondary max-w-2xl mx-auto">
							Four simple steps to make a real difference in your
							community
						</p>
					</motion.div>

					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="whileInView"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
					>
						{howItWorks.map((item, index) => (
							<motion.div
								key={index}
								variants={fadeInUp}
								className="relative"
							>
								<div className="card-elevated text-center">
									<div className="text-5xl font-bold text-forest-light/30 mb-4">
										{item.step}
									</div>
									<h3 className="text-xl font-semibold text-text-primary mb-3">
										{item.title}
									</h3>
									<p className="text-text-secondary">
										{item.description}
									</p>
								</div>
								{index < howItWorks.length - 1 && (
									<div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
										<ChevronRight
											className="text-forest-light"
											size={32}
										/>
									</div>
								)}
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 md:py-24 px-4">
				<motion.div
					{...fadeInUp}
					className="max-w-4xl mx-auto text-center"
				>
					<div className="bg-gradient-nature rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
						<div className="relative z-10">
							<h2 className="text-3xl md:text-4xl font-bold mb-4">
								Ready to Make a Difference?
							</h2>
							<p className="text-lg md:text-xl mb-8 opacity-90">
								Join thousands of community members already
								making our environment cleaner and safer
							</p>
							<Link href="/report">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="btn-tertiary"
								>
									Start Reporting Today
								</motion.button>
							</Link>
						</div>
						<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
						<div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
					</div>
				</motion.div>
			</section>

			{/* Footer */}
			<footer className="bg-forest-deep text-white py-12 px-4">
				<div className="max-w-7xl mx-auto">
					<div className="text-center text-white/80">
						<p>
							&copy; {new Date().getFullYear()} Ecosens. All
							rights reserved. Building a cleaner future together.
						</p>
					</div>
				</div>
			</footer>
		</main>
	);
}
