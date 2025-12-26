import type { Metadata } from "next";
import LoginPage from "./login";

export const metadata: Metadata = {
    title: "Login - EcoSens",
}

export default function Login() {
    return <LoginPage />;
}