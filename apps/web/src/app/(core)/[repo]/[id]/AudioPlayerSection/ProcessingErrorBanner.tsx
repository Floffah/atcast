import stylex from "@stylexjs/stylex";
import Link from "next/link";
import { PropsWithChildren } from "react";

import { Episode } from "@atcast/models";

import { Button } from "@/components/Button";
import { colours } from "@/styles/colours.stylex";
import { fontSizes, fontWeights, lineHeights } from "@/styles/fonts.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { sizes } from "@/styles/sizes.stylex";

export function ProcessingErrorBanner({
    children,
    internalEpisode,
}: PropsWithChildren<{ internalEpisode: Episode }>) {
    return (
        <div {...stylex.props(styles.container)}>
            <p {...stylex.props(styles.title)}>
                An error occurred while processing this episode
            </p>
            <p {...stylex.props(styles.description)}>{children}</p>
            <Button
                size="md"
                color="danger"
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
            default: colours.red200,
            [DARK]: colours.red950,
        },
        border: 1,
        borderStyle: "solid",
        borderColor: {
            default: colours.red400,
            [DARK]: colours.red800,
        },
    },

    title: {
        fontSize: fontSizes.lg,
        lineHeight: lineHeights.lg,
        fontWeight: fontWeights.semibold,

        color: {
            default: colours.red900,
            [DARK]: colours.red300,
        },
    },

    description: {
        fontSize: fontSizes.base,
        lineHeight: lineHeights.base,

        color: {
            default: colours.red800,
            [DARK]: colours.red300,
        },
    },

    button: {
        marginTop: sizes.spacing4,
    },
});
