import { AtUri } from "@atproto/api";
import stylex from "@stylexjs/stylex";
import Link from "next/link";

import { LiveAtcastShowEpisode } from "@atcast/atproto";

import { colours } from "@/styles/colours.stylex";
import { fontSizes, lineHeights } from "@/styles/fonts.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { shadows } from "@/styles/shadows.stylex";
import { sizes } from "@/styles/sizes.stylex";

export function EpisodeCard({
    show,
    uri,
}: {
    show: LiveAtcastShowEpisode.Record;
    uri: string;
}) {
    const url = new AtUri(uri);
    const id = url.pathname.split("/").pop();

    return (
        <Link href={`/show/${id}`} {...stylex.props(styles.container)}>
            <h3 {...stylex.props(styles.name)}>{show.name}</h3>
            <p {...stylex.props(styles.description)}>{show.description}</p>
        </Link>
    );
}

const DARK = "@media (prefers-color-scheme: dark)";
const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: sizes.spacing4,
        borderRadius: rounded.lg,
        gap: sizes.spacing2,
        backgroundColor: {
            default: colours.gray100,
            [DARK]: colours.gray900,
        },
        boxShadow: shadows.md,
        transitionProperty: "scale",
        transitionDuration: "150ms",
        scale: {
            default: 1,
            ":hover": 1.05,
        },
    },
    name: {
        fontSize: fontSizes.xl,
        lineHeight: lineHeights.xl,
        color: {
            default: colours.gray700,
            [DARK]: colours.gray300,
        },
    },
    description: {
        fontSize: "1rem",
        color: {
            default: colours.gray600,
            [DARK]: colours.gray400,
        },
    },
});
