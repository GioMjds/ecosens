'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useFormStore } from '@/stores/FormsStore';
import { useAdminLogin, useResidentLogin, useStaffLogin } from '@/hooks/auth/useAuth';
import { Eye, EyeOff, Leaf, Shield, Users, ChevronRight, AlertCircle } from 'lucide-react';
import { AuthLogin } from '@/types/auth/Auth.types';
import { UserRole, roles } from '@/constants/roles';
import Link from 'next/link';

export default function LoginPage() {
    const [selectedRole, setSelectedRole] = useState<UserRole>('resident');

    const { showPassword, setShowPassword } = useFormStore();

    const adminMutation = useAdminLogin();
    const staffMutation = useStaffLogin();
    const residentMutation = useResidentLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthLogin>({
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: AuthLogin) => {
        try {
            const payload = { email: data.email, password: data.password };
            console.log('Login attempt:', { ...payload, role: selectedRole });

            let response;

            switch (selectedRole) {
                case 'admin': 
                    response = await adminMutation.mutateAsync(payload);
                    break;
                case 'staff':
                    response = await staffMutation.mutateAsync(payload);
                    break;
                case 'resident':
                default:
                    response = await residentMutation.mutateAsync(payload);
                    break;
            }

            console.log('Login success:', response);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    const isLoading = (role: string) => {
        switch (role) {
            case 'admin':
                return adminMutation.isPending;
            case 'staff':
                return staffMutation.isPending;
            case 'resident':
            default:
                return residentMutation.isPending;
        }
    }

    return (
        <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-forest-light/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-sunlight/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-forest-mid/5 rounded-full blur-3xl -z-10"></div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-6xl"
            >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <motion.div variants={itemVariants} className="hidden md:block">
                        <div className="space-y-6">
                            <motion.div
                                className="flex items-center space-x-3"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="w-12 h-12 bg-gradient-nature rounded-xl flex items-center justify-center shadow-button">
                                    <Leaf className="w-7 h-7 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold text-forest-deep">
                                    Ecosens
                                </h1>
                            </motion.div>

                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-text-primary">
                                    Welcome Back!
                                </h2>
                                <p className="text-lg text-text-secondary leading-relaxed">
                                    Sign in to continue reporting and tracking environmental
                                    issues in your community. Together, we're building a
                                    cleaner future.
                                </p>
                            </div>

                            <div className="space-y-3 pt-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-state-success/20 rounded-lg flex items-center justify-center mt-1 shrink-0">
                                        <Shield className="w-4 h-4 text-state-success" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-text-primary">
                                            Secure Access
                                        </h3>
                                        <p className="text-sm text-text-secondary">
                                            Your data is protected with industry-standard
                                            encryption
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-forest-light/20 rounded-lg flex items-center justify-center mt-1 shrink-0">
                                        <Users className="w-4 h-4 text-forest-mid" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-text-primary">
                                            Community Impact
                                        </h3>
                                        <p className="text-sm text-text-secondary">
                                            Join thousands making a difference every day
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className="card-elevated max-w-md mx-auto">
                            <div className="md:hidden flex items-center justify-center space-x-2 mb-6">
                                <div className="w-10 h-10 bg-gradient-nature rounded-lg flex items-center justify-center">
                                    <Leaf className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-forest-deep">
                                    Ecosens
                                </h1>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-text-primary mb-2">
                                    Sign In
                                </h2>
                                <p className="text-text-secondary">
                                    Select your role and enter your credentials
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-text-primary mb-3">
                                    Login As
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {roles.map((role) => {
                                        const Icon = role.icon;
                                        const isSelected = selectedRole === role.id;

                                        return (
                                            <motion.button
                                                key={role.id}
                                                type="button"
                                                onClick={() => setSelectedRole(role.id)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`relative p-4 cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                                                    isSelected
                                                        ? `border-${role.color} bg-${role.color}/5`
                                                        : 'border-border-light hover:border-border-medium bg-white'
                                                }`}
                                            >
                                                <div className="flex flex-col items-center space-y-2">
                                                    <div
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                                            isSelected
                                                                ? `bg-${role.color} text-white`
                                                                : 'bg-background-tertiary text-icon-secondary'
                                                        }`}
                                                    >
                                                        <Icon size={20} />
                                                    </div>
                                                    <span
                                                        className={`text-sm font-medium ${
                                                            isSelected
                                                                ? `text-${role.color}`
                                                                : 'text-text-secondary'
                                                        }`}
                                                    >
                                                        {role.name}
                                                    </span>
                                                </div>

                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            exit={{ scale: 0 }}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-state-success rounded-full flex items-center justify-center shadow-md"
                                                        >
                                                            <svg
                                                                className="w-4 h-4 text-white"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={3}
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-text-primary mb-2"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                        className={`input-field ${
                                            errors.email ? 'border-state-error' : ''
                                        }`}
                                        placeholder="your.email@example.com"
                                    />
                                    <AnimatePresence>
                                        {errors.email && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center space-x-1 mt-2 text-state-error text-sm"
                                            >
                                                <AlertCircle size={14} />
                                                <span>{errors.email.message}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-text-primary"
                                        >
                                            Password
                                        </label>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            className="text-sm text-forest-mid hover:text-forest-deep transition-colors cursor-pointer"
                                        >
                                            Forgot password?
                                        </motion.button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            {...register('password', {
                                                required: 'Password is required',
                                                minLength: {
                                                    value: 6,
                                                    message:
                                                        'Password must be at least 6 characters',
                                                },
                                            })}
                                            className={`input-field pr-12 ${
                                                errors.password ? 'border-state-error' : ''
                                            }`}
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-secondary hover:text-icon-primary transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>
                                    <AnimatePresence>
                                        {errors.password && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center space-x-1 mt-2 text-state-error text-sm"
                                            >
                                                <AlertCircle size={14} />
                                                <span>{errors.password.message}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <motion.button
                                    type="button"
                                    disabled={isLoading(selectedRole)}
                                    onClick={handleSubmit(onSubmit)}
                                    whileHover={{ scale: isLoading(selectedRole) ? 1 : 1.02 }}
                                    whileTap={{ scale: isLoading(selectedRole) ? 1 : 0.98 }}
                                    className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading(selectedRole) ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: 'linear',
                                                }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ChevronRight size={20} />
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-text-secondary">
                                    Don't have an account?{' '}
                                    <Link
                                        href='/register'
                                        type="button"
                                        className="text-forest-mid cursor-pointer hover:text-forest-deep font-medium transition-colors"
                                    >
                                        Sign up as Resident
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <motion.p
                            variants={itemVariants}
                            className="text-center text-sm text-text-tertiary mt-6"
                        >
                            By signing in, you agree to our{' '}
                            <button type="button" className="text-forest-mid hover:underline">
                                Terms of Service
                            </button>{' '}
                            and{' '}
                            <button type="button" className="text-forest-mid hover:underline">
                                Privacy Policy
                            </button>
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}