const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../../");

module.exports = {
    plugins: {
        "@stylexswc/postcss-plugin": {
            include: ["src/**/*.{js,jsx,ts,tsx}"],
            rsOptions: {
                isDev: process.env.NODE_ENV === "development",
                genConditionalClasses: true,
                treeshakeCompensation: true,
                useRemForFontSize: true,
                aliases: {
                    "@/*": [path.join(projectRoot, "src/*")],
                },
                unstable_moduleResolution: {
                    type: "commonJS",
                    rootDir: projectRoot,
                },
            },
            useCSSLayers: true,
        },
        "postcss-preset-env": {},
    },
};
