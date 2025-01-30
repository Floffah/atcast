import { ComAtprotoRepoListRecords } from "@atproto/api";
import stylex from "@stylexjs/stylex";
import Link from "next/link";

import { LiveAtcastPodcastShow, RecordNSIDs } from "@atcast/atproto";

import { Button } from "@/components/Button";
import { ShowCard } from "@/components/ui/ShowCard";
import { createPdsClient } from "@/lib/api/pdsClient";
import { getSessionFromRuntime } from "@/lib/server/data/getSession";
import { colours } from "@/styles/colours.stylex";
import { fontSizes, lineHeights } from "@/styles/fonts.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { sizes } from "@/styles/sizes.stylex";

export async function MyShowsSection() {
    const { session, user } = await getSessionFromRuntime();

    let recordsResponse: ComAtprotoRepoListRecords.Response | undefined =
        undefined;

    if (session) {
        const pds = await createPdsClient({
            session: session,
            did: user.did,
        });

        recordsResponse = await pds.com.atproto.repo.listRecords({
            repo: user.did,
            collection: RecordNSIDs.SHOW,
        });
    }

    const shows = recordsResponse?.data
        .records as (ComAtprotoRepoListRecords.Record & {
        value: LiveAtcastPodcastShow.Record;
    })[];

    return (
        <section {...stylex.props(styles.container)}>
            <h2 {...stylex.props(styles.heading)}>My Shows</h2>

            {(!shows || shows.length === 0) && (
                <div {...stylex.props(styles.noPodcastsCTA)}>
                    <p>Publish your first podcast and become a creator</p>
                    <Button size="md" color="primary" asChild>
                        <Link href="/show/create">Get Started</Link>
                    </Button>
                </div>
            )}

            {shows && shows.length && (
                <div {...stylex.props(styles.showsList)}>
                    {shows.map((record) => (
                        <ShowCard
                            show={record.value}
                            key={record.uri}
                            uri={record.uri}
                        />
                    ))}
                </div>
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
        borderRadius: rounded.lg,
        backgroundColor: {
            default: colours.gray100,
            [DARK]: colours.gray900,
        },
    },

    showsList: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: sizes.spacing4,
    },
});
