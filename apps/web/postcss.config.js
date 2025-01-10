const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../../");

module.exports = {
    plugins: {
        "@stylexswc/postcss-plugin": {
            include: ["src/**/*.{js,jsx,ts,tsx}"],
            rsOptions: require("./stylex.config"),
            extractCSS: false,
        },
        "postcss-preset-env": {},
        cssnano: {
            preset: ["default", { discardUnused: true }],
        },
    },
};
