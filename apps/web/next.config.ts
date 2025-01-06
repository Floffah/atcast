import stylexPlugin from "@stylexswc/nextjs-plugin";
import autoprefixer from "autoprefixer";
import type { NextConfig } from "next";
import path from "node:path";
import postcss from "postcss";
import Icons from "unplugin-icons/webpack";

const projectRoot = __dirname;
const rootDir = path.resolve(projectRoot, "../../");

const withStylex = stylexPlugin({
    rsOptions: {
        dev: process.env.NODE_ENV === "development",
        test: process.env.NODE_ENV === "test",
        runtimeInjection: false,
        genConditionalClasses: true,
        treeshakeCompensation: true,
        useRemForFontSize: true,
        aliases: {
            "@/*": [path.join(projectRoot, "src/*")],
        },
        unstable_moduleResolution: {
            type: "commonJS",
            rootDir,
        },
    },
    stylexImports: ["@stylexjs/stylex"],
    useCSSLayers: true,
    extractCSS: false,
});

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
