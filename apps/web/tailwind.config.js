/** @type {import('tailwindcss').Config} */
module.exports = {
    content: {
        relative: true,
        files: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    },

    darkMode: [
        "variant",
        [
            "@media (prefers-color-scheme: dark) { &:not(.light *) }",
            "&:is(.dark *)",
        ],
    ],

    theme: {
        fontFamily: {
            sans: "var(--font-sans)",
        },
        extend: {
            colors: {
                discord: {
                    blurple: "#5865F2",
                },
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
