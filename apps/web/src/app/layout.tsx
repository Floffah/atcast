import "./globals.css";
import stylex, { StyleXStyles } from "@stylexjs/stylex";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { PropsWithChildren, Suspense } from "react";
import { Monitoring } from "react-scan/monitoring/next";

import { DevDisclaimerBanner } from "@/components/ui/DevDisclaimerBanner";
import { populateMetadata } from "@/lib/utils/populateMetadata";
import { APIProvider } from "@/providers/APIProvider";
import { QueryClientProvider } from "@/providers/QueryClientProvider";
import { fontSizes, fonts, lineHeights } from "@/styles/fonts.stylex";
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
                {process.env.NODE_ENV === "development" && (
                    <Script
                        src="https://unpkg.com/react-scan/dist/auto.global.js"
                        async
                        strategy="beforeInteractive"
                    />
                )}
                {process.env.NODE_ENV === "production" && (
                    <Script
                        src="https://unpkg.com/react-scan/dist/install-hook.global.js"
                        strategy="beforeInteractive"
                    />
                )}
            </head>
            <body {...stylex.props(styles.body)}>
                {process.env.NODE_ENV === "production" && (
                    <Monitoring
                        apiKey={
                            process.env.NEXT_PUBLIC_REACT_SCAN_API_KEY as string
                        }
                        url="https://monitoring.react-scan.com/api/v1/ingest"
                        commit={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}
                        branch={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}
                    />
                )}
                <QueryClientProvider>
                    <APIProvider>
                        {children}

                        <Suspense>
                            <DevDisclaimerBanner />
                        </Suspense>
                    </APIProvider>
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
        backgroundColor: theme.background,
        color: theme.foreground,
        fontFamily: fonts.sans,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.base,
    },
});
