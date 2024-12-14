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
                    required: ["redirectUrl"],
                    properties: {
                        redirectUrl: {
                            type: "string",
                            format: "uri",
                            description: "The URL to send the user to",
                        },
                    },
                },
            },
            errors: [
                {
                    name: "InvalidHandle",
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
                    required: ["handle", "code"],
                    properties: {
                        handle: {
                            type: "string",
                            format: "handle",
                            description: "User handle",
                        },
                        code: {
                            type: "string",
                            description: "OAuth code",
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
                    name: "InvalidHandle",
                },
                {
                    name: "InvalidToken",
                },
            ],
        },
    },
} satisfies LexiconDoc;