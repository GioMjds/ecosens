import type { Metadata } from "next";
import ReportPage from "./report";

export const metadata: Metadata = {
    title: "Report An Issue",
    description: "This is the report page",
}

export default function Report() {
    return <ReportPage />;
}