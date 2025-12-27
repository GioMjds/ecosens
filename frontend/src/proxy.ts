import { type NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Public frontend auth pages which should redirect authenticated users away
    const authPages = new Set(['/login', '/register', '/forgot', '/otp', '/reset']);
    const isAuthPage = authPages.has(pathname);

    const adminAccess = req.cookies.get('admin_access')?.value;
    const staffAccess = req.cookies.get('staff_access')?.value;
    const residentAccess = req.cookies.get('access_token')?.value;

    const isAuthenticated = Boolean(adminAccess || staffAccess || residentAccess);

    // If an authenticated user tries to visit an auth page, redirect them to root
    if (isAuthPage && isAuthenticated) {
        const url = req.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // Protect API routes by cookie values (backend sets these cookies on login):
    // - admin endpoints expect `admin_access`
    // - staff endpoints expect `staff_access`
    // - resident endpoints expect `access_token`
    // Public report submissions (POST /api/report) are allowed anonymously.
    // This lets anonymous or public users submit reports without being authenticated.
    // Moderation endpoints should still require the corresponding role cookie.
    
    // Allow anonymous public report POSTs
    if (pathname.startsWith('/api/report') && req.method === 'POST') {
        return NextResponse.next();
    }
    
    if (pathname.startsWith('/api/admin')) {
        const adminCookie = req.cookies.get('admin_access')?.value;
        if (!adminCookie) return NextResponse.json({ message: 'Unauthorized - admin_access required' }, { status: 401 });
        return NextResponse.next();
    }

    if (pathname.startsWith('/api/staff')) {
        const staffCookie = req.cookies.get('staff_access')?.value;
        if (!staffCookie) return NextResponse.json({ message: 'Unauthorized - staff_access required' }, { status: 401 });
        return NextResponse.next();
    }

    if (pathname.startsWith('/api')) {
        const hasAccess = !!(
            residentAccess ||
            adminAccess ||
            staffAccess
        );

        if (!hasAccess) return NextResponse.json({ message: 'Unauthorized - authentication required' }, { status: 401 });
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*', '/login', '/register', '/forgot', '/otp', '/reset'],
};