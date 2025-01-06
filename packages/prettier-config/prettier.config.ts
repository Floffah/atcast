import { Config } from "prettier";

export const withBase = (config: Config) =>
    ({
        trailingComma: "all",
        tabWidth: 4,
        semi: true,
        singleQuote: false,
        jsxSingleQuote: false,
        jsxBracketSameLine: false,
        arrowParens: "always",
        endOfLine: "lf",
        embeddedLanguageFormatting: "auto",

        importOrder: [
            "<THIRD_PARTY_MODULES>",
            "^@atcast/(.*)$",
            "^(@/|~)(.*)$",
        ],
        importOrderSeparation: true,
        importOrderSortSpecifiers: true,
        importOrderGroupNamespaceSpecifiers: true,

        ...config,
        plugins: [
            "@trivago/prettier-plugin-sort-imports",
            ...(config.plugins ?? []),
        ],
    }) satisfies Config;
