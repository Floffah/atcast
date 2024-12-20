import { LexiconDoc } from "@atproto/lexicon";

export const LiveAtcastAuthCreateSession = {
    lexicon: 1,
    id: "live.atcast.auth.createSession",
    defs: {
        start: {
            type: "procedure",
            description:
                "Start the authentication flow. Atcast OAuth extension of com.atproto.server.createSession",
            input: {
                encoding: "application/json",
                schema: {
                    type: "object",
                    required: ["handle"],
                    properties: {
                        handle: {
                            type: "string",
                            format: "handle",
                            description: "User handle",
                        },
                    },
                },
            },
            output: {
                encoding: "application/json",
                schema: {
                    type: "object",
                    required: ["url"],
                    properties: {
                        url: {
                            type: "string",
                            format: "uri",
                            description:
                                "Authorization URL to send the user to",
                        },
                    },
                },
            },
            errors: [
                {
                    name: "InvalidHandle",
                },
                {
                    name: "FailedToCreateRequest",
                },
            ],
        },
        finish: {
            type: "procedure",
            description:
                "Finish the authentication flow. Atcast OAuth extension of com.atproto.server.finishSession",
            input: {
                encoding: "application/json",
                schema: {
                    type: "object",
                    required: ["iss", "state", "code"],
                    properties: {
                        iss: {
                            type: "string",
                            format: "uri",
                            description: "Issuer",
                        },
                        state: {
                            type: "string",
                            description: "State",
                        },
                        code: {
                            type: "string",
                            description: "Authorization code",
                        },
                    },
                },
            },
            output: {
                encoding: "application/json",
                schema: {
                    type: "object",
                    required: ["token"],
                    properties: {
                        token: {
                            type: "string",
                            description: "Session token",
                        },
                    },
                },
            },
            errors: [
                {
                    name: "InvalidInput",
                },
                {
                    name: "InvalidUser",
                    description: "User does not exist or is not identifiable",
                },
            ],
        },
    },
} satisfies LexiconDoc;
