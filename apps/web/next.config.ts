import stylexConfig from "./stylex.config";
import stylexPlugin from "@stylexswc/nextjs-plugin";
import type { NextConfig } from "next";
import Icons from "unplugin-icons/webpack";

const withStylex = stylexPlugin({
    rsOptions: stylexConfig,
    extractCSS: false,
});

const nextConfig = {
    reactStrictMode: true,
    serverExternalPackages: ["@node-rs/bcrypt"],
    experimental: {
        ppr: true,
    },
    typescript: {
        // part of lint step, next ignores tsconfig references and breaks trpc
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

        return config;
    },
} satisfies NextConfig;

export default withStylex(nextConfig);
