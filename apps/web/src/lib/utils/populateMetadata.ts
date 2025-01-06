import { Metadata } from "next";

interface PopulateMetadataOptions {
    title?: string;
    description?: string;
}

export function populateMetadata(
    { title, description }: PopulateMetadataOptions,
    override: Metadata = {},
): Metadata {
    return {
        metadataBase: new URL("https://atcast.live"),
        title,
        description,
        openGraph: {
            title,
            description,
            ...override.openGraph,
        },
        twitter: {
            title,
            description,
            ...override.twitter,
        },
        ...override,
    };
}
