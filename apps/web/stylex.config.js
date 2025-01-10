const path = require("path");

const projectRoot = __dirname;
// const monorepoRoot = path.resolve(projectRoot, "../../");

module.exports = {
    isDev: process.env.NODE_ENV === "development",
    dev: process.env.NODE_ENV === "development",
    debug: process.env.NODE_ENV === "development",
    test: process.env.NODE_ENV === "test",
    runtimeInjection: false,
    aliases: {
        "@/*": [path.join(projectRoot, "src/*")],
    },
    unstable_moduleResolution: {
        type: "commonJS",
        rootDir: projectRoot,
    },
}
