import type { Metadata } from "next";
import FeaturesPage from "./features";

export const metadata: Metadata = {
    title: "EcoSens Features",
    description: "This lists all features of EcoSens",
}

export default function Features() {
    return <FeaturesPage />;
}