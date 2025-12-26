import { httpClient } from "@/configs/axios";
import { AuthLogin } from "@/types/auth/Auth.types";

const admins = httpClient.endpoint('admin');
const staffs = httpClient.endpoint('staff');
const residents = httpClient.endpoint('resident');

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
        return residents.post('/login', {
            email: email,
            password: password
        });
    },

    async register() {
        return residents.post('/register');
    },

    async logout() {
        return residents.post('/logout');
    }
}