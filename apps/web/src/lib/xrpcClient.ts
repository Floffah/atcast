import { AtClient } from "@atcast/atproto";

export function createXRPCClient() {
    let url: URL;

    if (typeof window !== "undefined") {
        url = new URL("/", window.location.origin);
    } else {
        url = new URL(process.env.NEXT_PUBLIC_BASE_URL!);
    }

    return new AtClient(url);
}
