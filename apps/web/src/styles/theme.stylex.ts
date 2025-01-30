import stylex from "@stylexjs/stylex";

import { colours } from "@/styles/colours.stylex";

const DARK = "@media (prefers-color-scheme: dark)";

// Colours MUST be tailwind colours = https://tailwindcss.com/docs/customizing-colors
// We cannot import them as stylex requires literal values
export const theme = stylex.defineVars({
    foreground: {
        default: colours.gray800,
        [DARK]: "white",
    },
    background: {
        default: "white",
        [DARK]: colours.gray950,
    },

    primaryForeground: "white",
    primaryBackground: {
        default: colours.blue500,
        [DARK]: colours.blue700,
    },
    secondaryForeground: {
        default: "black",
        [DARK]: "white",
    },
    secondaryBackground: {
        default: "rgb(from black r g b / 10%)",
        [DARK]: "rgb(from white r g b / 10%)",
    },
    successForeground: "white",
    successBackground: {
        default: colours.green500,
        [DARK]: colours.green700,
    },
    dangerForeground: "white",
    dangerBackground: {
        default: colours.red500,
        [DARK]: colours.red800,
    },

    // -- element colours --

    // forms

    controlBackground: "transparent",
    controlForeground: {
        default: "black",
        [DARK]: "white",
    },
    controlDisabledForeground: {
        default: "rgb(from black r g b / 60%)",
        [DARK]: "rgb(from white r g b / 60%)",
    },
    controlBorder: {
        default: `1px solid ${colours.gray400}`,
        [DARK]: `1px solid ${colours.gray700}`,
    },
    controlFocusedBorder: `1px solid ${colours.blue600}`,
    controlErrorBorder: `1px solid ${colours.red500}`,
    controlDisabledBorder: `1px solid rgb(from ${colours.gray700}r g b / 60%)`,
    controlDisabledErrorBorder: `1px solid rgb(from ${colours.red500}r g b / 60%)`,
    controlPlaceholderForeground: {
        default: "rgb(from black r g b / 40%)",
        [DARK]: "rgb(from white r g b / 40%)",
    },
    controlDisabledPlaceholderForeground: {
        default: "rgb(from black r g b / 20%)",
        [DARK]: "rgb(from white r g b / 20%)",
    },
});
