import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
        name: "Your app name here",
        description: "Your app description here.",
        start_url: "/",
        display: "standalone",
        background_color: "#18181b",
        theme_color: "#18181b",
        icons: [
            {
                src: '/favicon.ico',
                sizes: '64x64 32x32 24x24 16x16',
                type: 'image/x-icon'
            }
        ],
	};
}