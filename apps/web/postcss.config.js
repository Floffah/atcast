const path = require("path");

const projectRoot = __dirname;
const rootDir = path.join(projectRoot, "../../");

module.exports = {
    plugins: {
        "@stylexswc/postcss-plugin": {
            include: [projectRoot + "/src/**/*.{js,jsx,ts,tsx}"],
            useCSSLayers: true,
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
            cwd: rootDir,
        },
        "postcss-preset-env": {},
    },
};
