import stylex from "@stylexjs/stylex";

import { colours } from "@/styles/colours.stylex";
import { fontSizes, lineHeights } from "@/styles/fonts.stylex";
import { sizes } from "@/styles/sizes.stylex";

export async function ActivityFeedSection() {
    return (
        <section {...stylex.props(styles.container)}>
            <h2 {...stylex.props(styles.heading)}>Activity</h2>

            <div {...stylex.props(styles.noActivityCTA)}>
                <p>Follow some shows to see activity</p>
            </div>
        </section>
    );
}

const DARK = "@media (prefers-color-scheme: dark)";

const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing4,
    },

    heading: {
        fontSize: fontSizes.xl,
        lineHeight: lineHeights.xl,
    },

    noActivityCTA: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: sizes.spacing40,
        color: {
            default: colours.gray500,
            [DARK]: colours.gray400,
        },
    },
});
