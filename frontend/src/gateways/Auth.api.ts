import { httpClient } from "@/configs/axios";

const admins = httpClient.endpoint('admin');
const staffs = httpClient.endpoint('staff');
const residents = httpClient.endpoint('resident');

export const admin = {
    async login() {
        return await admins.post('/login');
    },

    async logout() {
        return await admins.post('/logout');
    },
};

export const staff = {
    async login() {
        return staffs.post('/login');
    },

    async logout() {
        return staffs.post('/logout');
    }
}

export const resident = {

}