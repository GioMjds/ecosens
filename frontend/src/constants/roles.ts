import { User, Shield } from "lucide-react";

export type UserRole = 'resident' | 'staff' | 'admin';

export const roles = [
	{
		id: 'resident' as UserRole,
		name: 'Resident',
		icon: User,
		description: 'Community member account',
		color: 'forest-deep',
	},
	{
		id: 'staff' as UserRole,
		name: 'Staff',
		icon: Shield,
		description: 'Staff member access',
		color: 'forest-deep',
	},
	{
		id: 'admin' as UserRole,
		name: 'Admin',
		icon: Shield,
		description: 'Administrator access',
		color: 'forest-deep',
	},
];
