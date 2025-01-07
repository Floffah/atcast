const projectRoot = __dirname;

module.exports = {
    plugins: {
        "@stylexswc/postcss-plugin": {
            include: [projectRoot + "/src/**/*.{js,jsx,ts,tsx}"],
            ...require("./stylex.config"),
        },
        "postcss-preset-env": {},
    },
};
