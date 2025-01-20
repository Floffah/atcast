import stylex from "@stylexjs/stylex";

import { Button } from "@/components/Button";
import { colours } from "@/styles/colours.stylex";
import { fontSizes, lineHeights } from "@/styles/fonts.stylex";
import { radii } from "@/styles/radii.stylex";
import { sizes } from "@/styles/sizes.stylex";

export async function MyShowsSection() {
    return (
        <section {...stylex.props(styles.container)}>
            <h2 {...stylex.props(styles.heading)}>My Shows</h2>

            <div {...stylex.props(styles.noPodcastsCTA)}>
                <p>Publish your first podcast and become a creator</p>
                <Button size="md" color="primary" link="/show/create">
                    Get Started
                </Button>
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

    noPodcastsCTA: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing4,
        justifyContent: "center",
        alignItems: "center",
        height: sizes.spacing40,
        borderRadius: radii.lg,
        backgroundColor: {
            default: colours.gray100,
            [DARK]: colours.gray900,
        },
    },
});
