import { type NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
    return
}

export const config = {
    matcher: ["/api/:path*"],
}