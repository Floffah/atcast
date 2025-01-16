import stylex, { StyleXStyles } from "@stylexjs/stylex";
import NextLink from "next/link";
import { ComponentProps, forwardRef } from "react";

import { composeStyles } from "@/lib/utils/composeStyles";
import { colours } from "@/styles/colours.stylex";

export const Link = forwardRef<
    HTMLAnchorElement,
    Omit<ComponentProps<typeof NextLink>, "style" | "ref"> & {
        colour: "inherit" | "link";
        style?: StyleXStyles;
    }
>(({ colour, className, style, ...props }, ref) => (
    <NextLink
        {...props}
        ref={ref}
        {...composeStyles(
            stylex.props(
                styles.base,
                colour === "inherit" && styles.inherit,
                colour === "link" && styles.link,
                style,
            ),
            className,
        )}
    />
));

const DARK = "@media (prefers-color-scheme: dark)";
const styles = stylex.create({
    base: {},
    inherit: {
        color: "inherit",
        textDecoration: "none",
    },
    link: {
        color: {
            default: colours.blue700,
            [DARK]: colours.blue300,
        },
        textDecoration: "underline",
    },
});
