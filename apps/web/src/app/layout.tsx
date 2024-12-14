import clsx from "clsx";
import { Inter } from "next/font/google";

import "@/app/globals.css";
import { populateMetadata } from "@/lib/populateMetadata";
import { XRCPClientProvider } from "@/providers/XRPCClientProvider";

export const metadata = populateMetadata({
    title: "AtCast",
    description: "Podcast system for the At Protocol",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={inter.variable}>
            <body className={clsx(inter.className, "antialiased")}>
                <XRCPClientProvider>{children}</XRCPClientProvider>
            </body>
        </html>
    );
}
