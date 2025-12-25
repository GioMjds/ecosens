export interface PopoverPosition {
	top: number;
	left: number;
}

export interface Popover {
	id: string;
	position?: PopoverPosition;
	placement?: 'top' | 'bottom' | 'left' | 'right';
	offset?: number;
	closeOnClickOutside?: boolean;
}