import stylex from "@stylexjs/stylex";

import { colours } from "@/styles/colours.stylex";
import { fontSizes, fontWeights, lineHeights } from "@/styles/fonts.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { sizes } from "@/styles/sizes.stylex";

export function EpisodeProcessingBanner() {
    return (
        <div {...stylex.props(styles.container)}>
            <p {...stylex.props(styles.title)}>Episode still processing</p>
            <p {...stylex.props(styles.description)}>
                Unfortunately you can&apos;t play this audio right now as
                we&apos;re still processing the episode. Please check back
                later!
            </p>
        </div>
    );
}

const DARK = "@media (prefers-color-scheme: dark)";

const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: sizes.spacing4,
        borderRadius: rounded.lg,
        backgroundColor: {
            default: colours.violet200,
            [DARK]: colours.indigo900,
        },
        border: 1,
        borderStyle: "solid",
        borderColor: {
            default: colours.violet400,
            [DARK]: colours.indigo500,
        },
    },

    title: {
        fontSize: fontSizes.lg,
        lineHeight: lineHeights.lg,
        fontWeight: fontWeights.semibold,
    },

    description: {
        fontSize: fontSizes.base,
        lineHeight: lineHeights.base,

        color: {
            default: colours.gray700,
            [DARK]: colours.gray300,
        },
    },
});
