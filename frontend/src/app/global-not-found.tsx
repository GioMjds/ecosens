import './globals.css';
import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';

const sourceSans3 = Source_Sans_3({
    variable: '--font-source-sans-3',
    subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Page Not Found',
	description: 'The requested page could not be found',
};

export default function GlobalNotFound() {
    return (
        <html lang='en'>
            <body className={`${sourceSans3.variable} ${sourceSans3.style} antialiased`}>
                <h1>Page Not Found</h1>
            </body>
        </html>
    )
}