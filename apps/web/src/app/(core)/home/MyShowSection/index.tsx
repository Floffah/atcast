import { AppBskyActorProfile } from "@atproto/api";
import stylex from "@stylexjs/stylex";
import Link from "next/link";

import { ComAtprotoRepoGetRecord } from "@atcast/atproto";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { createPDSClientFromRuntime } from "@/lib/api/authedPDSClient";
import { colours } from "@/styles/colours.stylex";
import { fontSizes, fontWeights, lineHeights } from "@/styles/fonts.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { sizes } from "@/styles/sizes.stylex";
import PlusIcon from "~icons/mdi/movie-plus-outline";

export async function MyShowSection() {
    const { client, user } = await createPDSClientFromRuntime();

    let recordsResponse: ComAtprotoRepoGetRecord.Response | undefined =
        undefined;

    if (client) {
        recordsResponse = await client.com.atproto.repo.getRecord({
            repo: user.did,
            collection: "app.bsky.actor.profile",
            rkey: "self",
        });
    }

    const profile = recordsResponse?.data?.value as AppBskyActorProfile.Record;

    return (
        <section {...stylex.props(styles.container)}>
            {!profile && (
                <div {...stylex.props(styles.noProfileCTA)}>
                    {user && (
                        <>
                            <p>
                                Set up your BlueSky profile to start publishing
                            </p>
                            <Button size="md" color="primary" asChild>
                                <Link
                                    href={`https://bsky.app/profile/${user.handle}`}
                                >
                                    Get Started
                                </Link>
                            </Button>
                        </>
                    )}

                    {!user && (
                        <>
                            <p>Log in to start publishing</p>
                            <Button size="md" color="primary" asChild>
                                <Link href="/">Login</Link>
                            </Button>
                        </>
                    )}
                </div>
            )}

            {profile && user && (
                <div {...stylex.props(styles.profile)}>
                    <div {...stylex.props(styles.headingContainer)}>
                        <h2 {...stylex.props(styles.nameHeading)}>
                            {profile.displayName}
                        </h2>

                        <span {...stylex.props(styles.handle)}>
                            at://{user.handle}
                        </span>
                    </div>

                    {profile.description && (
                        <p {...stylex.props(styles.bio)}>
                            {profile.description}
                        </p>
                    )}

                    <div {...stylex.props(styles.episodesGrid)}>
                        <Link
                            href={`/publish`}
                            {...stylex.props(styles.publishCTA)}
                        >
                            <p {...stylex.props(styles.publishMessage)}>
                                <Icon
                                    icon={PlusIcon}
                                    label="Add episode"
                                    {...stylex.props(styles.publishMessageIcon)}
                                />
                                Click to publish a new episode
                            </p>
                        </Link>
                    </div>
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

    noProfileCTA: {
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

    profile: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing4,
    },

    headingContainer: {
        display: "flex",
        gap: sizes.spacing2,
        alignItems: "center",
    },

    nameHeading: {
        fontSize: fontSizes.xl,
        lineHeight: lineHeights.xl,
    },

    handle: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
        fontWeight: fontWeights.semibold,
        color: colours.gray500,
    },

    bio: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
        color: colours.gray500,
    },

    episodesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: sizes.spacing4,
    },

    publishCTA: {
        display: "flex",
        flexDirection: "column",
        transitionProperty: "scale,background-color",
        transitionDuration: "150ms",
        padding: sizes.spacing4,
        borderRadius: rounded.lg,
        gap: sizes.spacing2,
        backgroundColor: {
            default: "transparent",
            ":hover": {
                default: colours.gray100,
                [DARK]: colours.gray900,
            },
        },
        borderColor: {
            default: colours.gray200,
            [DARK]: colours.gray800,
        },
        borderStyle: "dashed",
        borderWidth: 2,
        scale: {
            default: 1,
            ":hover": 1.05,
        },
    },
    publishMessage: {
        display: "flex",
        alignItems: "center",
        gap: sizes.spacing3,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.base,
        color: colours.gray500,
    },
    publishMessageIcon: {
        width: sizes.spacing8,
        height: sizes.spacing8,
        color: "inherit",
    },
});
