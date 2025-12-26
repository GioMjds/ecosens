import { useMutation } from "@tanstack/react-query";
import { admin, staff, resident } from "@/gateways/Auth.api";
import { AuthLogin } from "@/types/auth/Auth.types";

export function useAdminLogin() {
    return useMutation({
        mutationFn: ({ email, password }: AuthLogin) => admin.login({ email, password }),
        onSuccess: () => {

        },
        onError: (error) => {

        }
    });
}

export function useStaffLogin() {
    return useMutation({
        mutationFn: ({ email, password }: AuthLogin) => staff.login({ email, password }),
        onSuccess: () => {

        },
        onError: (error) => {

        }
    });
}

export function useResidentLogin() {
    return useMutation({
        mutationFn: ({ email, password }: AuthLogin) => resident.login({ email, password }),
        onSuccess: () => {

        },
        onError: (error) => {

        }
    });
}