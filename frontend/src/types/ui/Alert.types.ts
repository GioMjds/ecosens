type AlertVariant = "success" | "error" | "info" | "warning";

export interface Alert {
    id: string;
    title?: string;
    message: string;
    variant?: AlertVariant;
    duration?: number; // in milliseconds
    dismissible?: boolean;
}