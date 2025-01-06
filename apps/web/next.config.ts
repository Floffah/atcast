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
    // transformCss: async (css: any) => {
    //     const result = await postcss([autoprefixer]).process(css);
    //     return result.css;
    // },
    // extractCSS: false,
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

        // config.module ??= {};
        // config.module.rules ??= [];
        //
        // config.module.rules.unshift({
        //     test: /\.(?:js|jsx|ts|tsx|mjs|cjs)$/,
        //     exclude: /node_modules/,
        //     use: {
        //         loader: "babel-loader",
        //         options: {
        //             // targets: "defaults",
        //             // presets: ["@babel/preset-typescript"],
        //             presets: ["next/babel"],
        //             plugins: [
        //                 // [
        //                 //     "@babel/plugin-syntax-typescript",
        //                 //     {
        //                 //         isTSX: true,
        //                 //     },
        //                 // ],
        //                 [
        //                     "@stylexjs/babel-plugin",
        //                     // See all options in the babel plugin configuration docs:
        //                     // https://stylexjs.com/docs/api/configuration/babel-plugin/
        //                     {
        //                         dev: process.env.NODE_ENV === "development",
        //                         runtimeInjection: false,
        //                         genConditionalClasses: true,
        //                         treeshakeCompensation: true,
        //                         aliases: {
        //                             "@/*": [path.join(projectRoot, "src/*")],
        //                         },
        //                         unstable_moduleResolution: {
        //                             type: "commonJS",
        //                             rootDir,
        //                         },
        //                     },
        //                 ],
        //             ],
        //         },
        //     },
        // });

        return config;
    },
    images: {
        remotePatterns: [],
    },
} satisfies NextConfig;

export default withStylex(nextConfig);
