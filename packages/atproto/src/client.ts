import { XrpcClient } from "@atproto/xrpc";

import { atprotoLexicons } from "@/lexicons";

export class AtClient extends XrpcClient {
    live: LiveNS;

    constructor(opts: ConstructorParameters<typeof XrpcClient>[0]) {
        super(opts, atprotoLexicons);
        this.live = new LiveNS(this);
    }
}

class LiveNS {
    atcast: AtcastNS;

    constructor(private client: AtClient) {
        this.atcast = new AtcastNS(this.client);
    }
}

class AtcastNS {
    auth: AuthNS;
    feed: FeedNS;

    constructor(private client: AtClient) {
        this.auth = new AuthNS(this.client);
        this.feed = new FeedNS(this.client);
    }
}

class AuthNS {
    constructor(private client: AtClient) {}

    createSessionStart(handle: string) {
        return this.client.call(
            "live.atcast.auth.createSession#start",
            undefined,
            {
                handle,
            },
        );
    }

    createSessionFinish(iss: string, state: string, code: string) {
        return this.client.call(
            "live.atcast.auth.createSession#finish",
            undefined,
            {
                iss,
                state,
                code,
            },
        );
    }
}

class FeedNS {
    constructor(private client: AtClient) {}
}
