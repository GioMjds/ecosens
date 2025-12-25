type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface Modal {
    id: string;
    title?: string;
    content: React.ReactNode;
    size?: Size;
    closeOnOverlay?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    footer?: React.ReactNode;
    onClose?: () => void;
}