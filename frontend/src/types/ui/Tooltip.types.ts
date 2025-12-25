export interface TooltipPosition {
	top: number;
	left: number;
}

export interface Tooltip {
	id: string;
	content: string;
	position?: TooltipPosition;
	placement?: 'top' | 'bottom' | 'left' | 'right';
	delay?: number;
	visible?: boolean;
}