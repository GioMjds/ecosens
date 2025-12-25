type ToastVariant = "success" | "error" | "info" | "warning" | 'default';

type ToastPosition = 
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";

export interface Toast {
    id: string;
    title?: string;
    message?: string;
    variant?: ToastVariant;
    duration?: number; // in milliseconds
    position?: ToastPosition;
    action?: {
        label: string;
        onClick: () => void;
    };
}