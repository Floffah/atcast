import { AtpAgent, AtpAgentOptions, CredentialSession } from "@atproto/api";

export function createBskyClient(
    options: AtpAgentOptions | CredentialSession = {
        service: "https://public.api.bsky.app",
    },
) {
    return new AtpAgent(options);
}
