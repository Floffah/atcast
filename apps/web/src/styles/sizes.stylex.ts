import stylex from "@stylexjs/stylex";

// General sizes
// Sizes are in rem & baed on tailwind sizing, 1rem = 4 tailwind units
// In a perfect world, this var group has very little in it to keep the UI consistent
export const sizes = stylex.defineVars({
    h_screen: "100vh",
    w_screen: "100vw",

    spacing1: "0.25rem",
    spacing1_5: "0.375rem",
    spacing2: "0.5rem",
    spacing3: "0.75rem",
    spacing4: "1rem",
    spacing5: "1.25rem",
    spacing6: "1.5rem",
    spacing8: "2rem",
    spacing10: "2.5rem",
    spacing15: "3.75rem",
    spacing20: "5rem",
    spacing30: "7.5rem",
    spacing40: "10rem",
    spacing80: "20rem",
});
