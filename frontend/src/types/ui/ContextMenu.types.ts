export interface ContextMenuItem {
	label: string;
	icon?: React.ReactNode;
	onClick: () => void;
	disabled?: boolean;
	separator?: boolean;
}

export interface ContextMenu {
	id: string;
	x: number;
	y: number;
	items: ContextMenuItem[];
}