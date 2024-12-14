import { MetadataRoute } from "next";

function formatUrl(path = ""): string {
    return "https://atcast.live/" + path;
}

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: formatUrl(),
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
    ];
}
