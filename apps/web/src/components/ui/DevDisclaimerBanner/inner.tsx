"use client";

import stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Link } from "@/components/Link";
import { colours } from "@/styles/colours.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { sizes } from "@/styles/sizes.stylex";
import { theme } from "@/styles/theme.stylex";
import CloseIcon from "~icons/mdi/close";

export function DevDisclaimerBannerInner() {
    const [hidden, setHidden] = useState(false);

    return (
        <div {...stylex.props(styles.container, hidden && styles.hidden)}>
            <p>
                AtCast is a proof-of-concept and is in heavy development. I do
                not take responsibility for damages or data loss.{" "}
                <Link colour="link" href="https://github.com/Floffah/atcast">
                    See it on GitHub
                </Link>
            </p>

            <CloseIcon
                {...stylex.props(styles.closeIcon)}
                onClick={() => {
                    setHidden(true);

                    document.cookie =
                        "atcast-dev-disclaimer-dismissed=true; path=/; max-age=31536000";
                }}
            />
        </div>
    );
}

const DARK = "@media (prefers-color-scheme: dark)";

const styles = stylex.create({
    container: {
        display: "flex",
        alignItems: "center",
        padding: sizes.spacing4,
        gap: sizes.spacing4,
        borderRadius: rounded.lg,
        border: theme.controlBorder,
        backgroundColor: theme.controlBackground,
        maxWidth: "100%",
        boxSizing: "border-box",

        position: "fixed",
        bottom: 0,
        left: 0,
        margin: sizes.spacing6,
    },

    hidden: {
        display: "none",
    },

    closeIcon: {
        cursor: "pointer",
        transitionProperty: "scale",
        transitionDuration: "150ms",
        scale: {
            default: 1,
            ":hover": 1.15,
        },
        width: sizes.spacing6,
        height: sizes.spacing6,
        color: {
            default: colours.gray500,
            [DARK]: colours.gray600,
        },
    },
});
