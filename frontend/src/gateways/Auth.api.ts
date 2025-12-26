import { httpClient } from "@/configs/axios";
import { AuthLogin } from "@/types/auth/Auth.types";

const admins = httpClient.endpoint('admin');
const staffs = httpClient.endpoint('staff');

export const admin = {
    async login({ email, password }: AuthLogin) {
        return await admins.post('/login', {
            email: email,
            password: password
        });
    },

    async logout() {
        return await admins.post('/logout');
    },
};

export const staff = {
    async login({ email, password }: AuthLogin) {
        return staffs.post('/login', {
            email: email,
            password: password
        });
    },

    async logout() {
        return staffs.post('/logout');
    }
}

export const resident = {
    async login({ email, password }: AuthLogin) {
        return httpClient.post('/login', {
            email: email,
            password: password
        });
    },

    async register() {
        return httpClient.post('/register');
    },

    async logout() {
        return httpClient.post('/logout');
    }
}