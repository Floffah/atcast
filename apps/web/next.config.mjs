import Icons from "unplugin-icons/webpack";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverExternalPackages: ["@node-rs/bcrypt"],
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
};

export default nextConfig;
