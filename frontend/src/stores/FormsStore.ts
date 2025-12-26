import { create } from "zustand";

interface States {
    showPassword: boolean;
    showConfirmPassword?: boolean;
}

interface Actions {
    setShowPassword: (value: boolean) => void;
    setShowConfirmPassword?: (value: boolean) => void;
}

export const useFormStore = create<States & Actions>((set) => ({
    showPassword: false,
    showConfirmPassword: false,

    setShowPassword: (value: boolean) => set(() => ({ showPassword: value })),
    setShowConfirmPassword: (value: boolean) => set(() => ({ showConfirmPassword: value })),
}));