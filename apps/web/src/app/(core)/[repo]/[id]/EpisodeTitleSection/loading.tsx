import stylex from "@stylexjs/stylex";

import { colours } from "@/styles/colours.stylex";
import { fontSizes } from "@/styles/fonts.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { sizes } from "@/styles/sizes.stylex";

export function EpisodeTitleSectionLoading() {
    return (
        <section {...stylex.props(styles.container)}>
            <div {...stylex.props(styles.titleSkeleton)} />
            <div {...stylex.props(styles.descriptionSkeleton)} />
        </section>
    );
}

const pulseAnimation = stylex.keyframes({
    "0%, 100%": {
        opacity: 0.5,
    },
    "50%": {
        opacity: 1,
    },
});

const DARK = "@media (prefers-color-scheme: dark)";

const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing4,
    },

    titleSkeleton: {
        backgroundColor: {
            default: colours.gray100,
            [DARK]: colours.gray900,
        },
        animation: `${pulseAnimation} 4s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
        width: sizes.spacing40,
        height: fontSizes.xl,
        borderRadius: rounded.lg,
    },

    descriptionSkeleton: {
        backgroundColor: {
            default: colours.gray100,
            [DARK]: colours.gray900,
        },
        animation: `${pulseAnimation} 4s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
        width: "100%",
        maxWidth: sizes.spacing96,
        height: sizes.spacing40,
        borderRadius: rounded.lg,
    },
});
