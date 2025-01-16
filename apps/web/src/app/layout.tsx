import "./globals.css";
import stylex, { StyleXStyles } from "@stylexjs/stylex";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { PropsWithChildren } from "react";

import { populateMetadata } from "@/lib/utils/populateMetadata";
import { APIProvider } from "@/providers/APIProvider";
import { QueryClientProvider } from "@/providers/QueryClientProvider";
import { fonts } from "@/styles/fonts.stylex";
import { theme } from "@/styles/theme.stylex";

export const metadata = populateMetadata({
    title: "AtCast",
    description: "Podcast system for the At Protocol",
});

const geistSans = Geist({
    variable: "--font-sans",
    subsets: ["latin"],
    adjustFontFallback: false,
});

const geistMono = Geist_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
    adjustFontFallback: false,
});

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html
            lang="en"
            {...stylex.props(styles.html, {
                "--font-sans": geistSans.style.fontFamily,
                "--font-mono": geistMono.style.fontFamily,
            } as StyleXStyles)}
        >
            <head>
                <Script
                    src="https://unpkg.com/react-scan/dist/auto.global.js"
                    async
                />
            </head>
            <body {...stylex.props(styles.body)}>
                <QueryClientProvider>
                    <APIProvider>{children}</APIProvider>
                </QueryClientProvider>
            </body>
        </html>
    );
}

const styles = stylex.create({
    html: {
        colorScheme: "dark light",
    },
    body: {
        fontFamily: fonts.sans,
        backgroundColor: theme.background,
        color: theme.foreground,
    },
});
