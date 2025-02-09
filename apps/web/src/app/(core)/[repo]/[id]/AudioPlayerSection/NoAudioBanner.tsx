import stylex from "@stylexjs/stylex";
import Link from "next/link";

import { Episode } from "@atcast/models";

import { Button } from "@/components/Button";
import { colours } from "@/styles/colours.stylex";
import { fontSizes, fontWeights, lineHeights } from "@/styles/fonts.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { sizes } from "@/styles/sizes.stylex";

export function NoAudioBanner({
    internalEpisode,
}: {
    internalEpisode: Episode;
}) {
    return (
        <div {...stylex.props(styles.container)}>
            <p {...stylex.props(styles.title)}>No Audio</p>
            <p {...stylex.props(styles.description)}>
                You haven&apos;t uploaded any audio yet. Upload some audio to
                get started.
            </p>

            <Button
                size="md"
                color="primary"
                asChild
                {...stylex.props(styles.button)}
            >
                <Link href={`/publish/${internalEpisode.id}`}>
                    Upload a new file
                </Link>
            </Button>
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

    button: {
        marginTop: sizes.spacing4,
    },
});
