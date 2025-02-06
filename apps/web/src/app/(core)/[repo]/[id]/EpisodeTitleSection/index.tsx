import { AtUri } from "@atproto/api";
import stylex from "@stylexjs/stylex";

import { LiveAtcastShowEpisode } from "@atcast/atproto";

import { createBskyClient } from "@/lib/api/bskyClient";
import { colours } from "@/styles/colours.stylex";
import { fontSizes, fontWeights, lineHeights } from "@/styles/fonts.stylex";
import { sizes } from "@/styles/sizes.stylex";

export async function EpisodeTitleSection({
    uri,
    episode,
}: {
    uri: AtUri;
    episode: LiveAtcastShowEpisode.Record;
}) {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const atprotoClient = createBskyClient();

    const profileRecord = await atprotoClient.app.bsky.actor.getProfile({
        actor: uri.host,
    });

    return (
        <section {...stylex.props(styles.container)}>
            <div {...stylex.props(styles.titleLine)}>
                <h2 {...stylex.props(styles.title)}>{episode.title}</h2>
                <p {...stylex.props(styles.authorSubtitle)}>
                    On {profileRecord.data.displayName}
                </p>
            </div>

            {episode.description && (
                <p {...stylex.props(styles.description)}>
                    {episode.description}
                </p>
            )}
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

    titleLine: {
        display: "flex",
        gap: sizes.spacing2,
        alignItems: "center",
    },

    title: {
        fontSize: fontSizes.xl,
        lineHeight: fontSizes.xl,
    },

    authorSubtitle: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
        color: colours.gray500,
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
