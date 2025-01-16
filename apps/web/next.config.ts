import stylexConfig from "./stylex.config";
import stylexPlugin from "@stylexswc/nextjs-plugin";
import type { NextConfig } from "next";
import Icons from "unplugin-icons/webpack";
import ReactComponentName from "react-scan/react-component-name/webpack";

const withStylex = stylexPlugin({
    rsOptions: stylexConfig,
    extractCSS: false,
});

const nextConfig = {
    reactStrictMode: true,
    serverExternalPackages: ["@node-rs/bcrypt"],
    experimental: {
        ppr: true,
        reactCompiler: true,
        dynamicIO: true,
        cacheLife: {
            wellKnown: {
                stale: 86400, // 1 day
                revalidate: 86400, // 1 day
                expire: 604800, // 7 days
            },
        },
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config) => {
        config.plugins ??= [];

        config.plugins.push(
            Icons({
                compiler: "jsx",
                jsx: "react",
            }),
        );

        if (process.env.NODE_ENV === "production") {
            config.plugins.push(ReactComponentName({}));
        }

        return config;
    },
} satisfies NextConfig;

export default withStylex(nextConfig);
