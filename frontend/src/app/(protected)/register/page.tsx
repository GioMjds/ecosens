import type { Metadata } from "next";
import RegisterPage from "./register";

export const metadata: Metadata = {
    title: "Create New Account - EcoSens",
}

export default function Register() {
    return <RegisterPage />;
}