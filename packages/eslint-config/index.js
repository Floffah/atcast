module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "prettier"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    rules: {
        "no-unused-vars": "off",
        "comma-dangle": ["error", "always-multiline"],
        "no-empty": [
            "error",
            {
                allowEmptyCatch: true,
            },
        ],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                args: "after-used",
                argsIgnorePattern: "^_",
                caughtErrors: "all",
                caughtErrorsIgnorePattern: "^_",
                destructuredArrayIgnorePattern: "^_",
                vars: "all",
                varsIgnorePattern: "^_",
                ignoreRestSiblings: false,
            },
        ],
        "@typescript-eslint/no-var-requires": "warn",
        "prettier/prettier": [
            "error",
            require("@atcast/prettier-config").withBase({}),
        ],
    },
    overrides: [
        {
            files: ["*.js", "*.js"],
            rules: {
                "@typescript-eslint/no-require-imports": "warn",
            },
        },
    ],
    settings: {
        prettier: true,
    },
    env: {
        node: true,
    },
};
