import { schemas } from "@atcast/atproto";

export function formatQueryKey<Endpoint extends (typeof schemas)[number]["id"]>(
    endpoint: Endpoint,
    input: any = {},
) {
    return [endpoint, input];
}
