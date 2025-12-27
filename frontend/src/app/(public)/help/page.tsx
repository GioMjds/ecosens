import type { Metadata } from "next";
import HelpPage from "./help";

export const metadata: Metadata = {
    title: "Help & FAQ",
    description: "This is the help page",
}

export default function Help() {
    return <HelpPage />;
}