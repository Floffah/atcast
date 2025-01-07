import stylexPlugin from "@stylexswc/nextjs-plugin";
import type { NextConfig } from "next";
import path from "node:path";
import Icons from "unplugin-icons/webpack";

const projectRoot = __dirname;
// const monorepoRoot = path.resolve(projectRoot, "../../");

const withStylex = stylexPlugin({
    rsOptions: {
        aliases: {
            "@/*": [path.join(projectRoot, "src/*")],
        },
        unstable_moduleResolution: {
            type: "commonJS",
            // rootDir: monorepoRoot,
        },
    },
    extractCSS: false,
});

const nextConfig = {
    reactStrictMode: true,
    serverExternalPackages: ["@node-rs/bcrypt"],
    transpilePackages: ["@stylexjs/open-props"],
    experimental: {
        // ppr: true,
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
