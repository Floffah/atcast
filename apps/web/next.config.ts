import stylexConfig from "./stylex.config";
import stylexPlugin from "@stylexswc/nextjs-plugin";
import type { NextConfig } from "next";
import Icons from "unplugin-icons/webpack";

const withStylex = stylexPlugin(stylexConfig);

const nextConfig = {
    reactStrictMode: true,
    serverExternalPackages: ["@node-rs/bcrypt"],
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

        return config;
    },
    images: {
        remotePatterns: [],
    },
} satisfies NextConfig;

export default withStylex(nextConfig);
