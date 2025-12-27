import type { Metadata } from "next";
import AboutPage from "./about";

export const metadata: Metadata = {
    title: "Public Page",
    description: "This is a public page",
}

export default function About() {
    return <AboutPage />;
}