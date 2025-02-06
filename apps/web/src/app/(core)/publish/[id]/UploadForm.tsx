"use client";

import { AtUri } from "@atproto/api";
import stylex from "@stylexjs/stylex";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { Link } from "@/components/Link";
import { UploadDropzone } from "@/components/uploadthing";
import { colours } from "@/styles/colours.stylex";
import { fontSizes, lineHeights } from "@/styles/fonts.stylex";
import { sizes } from "@/styles/sizes.stylex";

export function UploadForm({ url }: { url: string }) {
    const router = useRouter();

    const uri = useMemo(() => new AtUri(url), [url]);

    return (
        <div {...stylex.props(styles.container)}>
            <h2>Upload Audio</h2>

            <UploadDropzone
                endpoint="audioUploader"
                input={{
                    episodeUri: uri.toString(),
                }}
                appearance={{
                    container: stylex.props(styles.uploadZoneContainer)
                        .className,
                    label: stylex.props(styles.uploadZoneText).className,
                    allowedContent: stylex.props(styles.uploadZoneText)
                        .className,
                }}
                onUploadBegin={() => {
                    router.prefetch("/[repo]/[id]");
                }}
                onUploadError={(err) => {
                    alert(err.message);
                }}
                onClientUploadComplete={(res) => {
                    if (res.some((file) => file.serverData.processRequestId)) {
                        router.push(`/${uri.host}/${uri.rkey}`);
                    }
                }}
                {...stylex.props(styles.uploadZone)}
            />

            <p {...stylex.props(styles.uploadNotice)}>
                File not uploading?{" "}
                <Link
                    href="https://github.com/Floffah/atcast/wiki/Compressing-your-audio"
                    colour="link"
                    target="_blank"
                >
                    Try this
                </Link>
            </p>
        </div>
    );
}

const DARK = "@media (prefers-color-scheme: dark)";

const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: sizes.spacing4,
        margin: "0 auto",
        gap: sizes.spacing4,
        maxWidth: sizes.screenMd,
        width: "100%",
    },

    uploadZone: {
        width: "100%",
    },

    uploadZoneContainer: {
        borderColor: {
            [DARK]: colours.gray500,
        },
    },

    uploadZoneText: {
        color: colours.gray500,
    },

    uploadNotice: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
        color: colours.gray500,
        textAlign: "center",
    },
});
