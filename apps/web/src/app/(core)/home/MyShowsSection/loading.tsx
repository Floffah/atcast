import stylex from "@stylexjs/stylex";

import { colours } from "@/styles/colours.stylex";
import { fontSizes, lineHeights } from "@/styles/fonts.stylex";
import { radii } from "@/styles/radii.stylex";
import { sizes } from "@/styles/sizes.stylex";

export function MyShowsLoading() {
    return (
        <section {...stylex.props(styles.container)}>
            <h2 {...stylex.props(styles.heading)}>My Shows</h2>

            <div {...stylex.props(styles.myPodcastsSkeletonContainer)}>
                <div {...stylex.props(styles.skeleton)} />
                <div
                    {...stylex.props(
                        styles.skeleton,
                        styles.animationDelay(0.1),
                    )}
                />
                <div
                    {...stylex.props(
                        styles.skeleton,
                        styles.animationDelay(0.2),
                    )}
                />
            </div>
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

    heading: {
        fontSize: fontSizes.xl,
        lineHeight: lineHeights.xl,
    },

    myPodcastsSkeletonContainer: {
        display: "flex",
        flexDirection: "row",
        gap: sizes.spacing4,
    },

    skeleton: {
        backgroundColor: {
            default: colours.gray100,
            [DARK]: colours.gray900,
        },
        animation: `${pulseAnimation} 4s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
        width: "100%",
        height: sizes.spacing40,
        borderRadius: radii.lg,
        flexGrow: 1,
    },

    animationDelay: (delay) => ({
        animationDelay: delay,
    }),
});
