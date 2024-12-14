import { LexiconDoc, Lexicons } from "@atproto/lexicon";

import { LiveAtcastAuthCreateSession } from "@/lexicons/auth/LiveAtcastAuthCreateSession";
import { LiveAtcastFeedShow } from "@/lexicons/feed/LiveAtcastFeedShow";

export const atprotoSchemaDict = {
    LiveAtcastAuthCreateSession,
    LiveAtcastFeedShow,
};

export const atprotoSchemas: LexiconDoc[] = Object.values(
    atprotoSchemaDict,
) as LexiconDoc[];
export const atprotoLexicons: Lexicons = new Lexicons(atprotoSchemas);

export const atprotoIds = Object.fromEntries(
    Object.entries(atprotoSchemaDict).map(([key, value]) => [key, value.id]),
) as Record<string, string>;
