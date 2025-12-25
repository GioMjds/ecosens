import { useMutation } from "@tanstack/react-query";
import { auth } from "@/gateways/Auth.api";

export function useAuth() {
    const login = useMutation({
        mutationFn: () => auth.login(),
        onSuccess: (data) => {
            // Success logic here
        },
        onError: (error) => {
            // Error handling here
        }
    });

    const logout = useMutation({
        mutationFn: () => auth.logout(),
        onSuccess: (data) => {
            // Success logic here
        },
        onError: (error) => {
            // Error handling here
        }
    });

    return {
        login,
        logout,
    }
}