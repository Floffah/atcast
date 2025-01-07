const path = require("path");

const projectRoot = __dirname;
const rootDir = path.resolve(projectRoot, "../../");

module.exports = {
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
};
