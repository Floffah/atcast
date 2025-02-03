# AtCast

Proof-of-concept podcast distribution platform for the AtProto.

## Design Choices

### File upload

AtCast uses UploadThing instead of storing episodes in the pds. **This will be changed in the future** once I find a good way to store very large files in an AtProto PDS without hitting limits or annoying BlueSky's admins.

This is also so that AtCast can provide a kind of CDN interface using regular rest/http/hls, etc, where services (i.e. Spotify) can't interact with the AtProto. Once the PDS issue is solved, the UploadThing repository will be used as a mirror to store generated streamable audio segments.

### Podcast model

An AtProto account its self is considered as the brand for the show, a single account cannot create multiple shows. To own multiple accounts, the user must have a unique handle for each. Profiles and information are currently derived from the app.bsky.actor.profile lexicon.

## Setup

When running yourself, it is as simple as ensuring you have Bun installed and the appropriate environment variables. Here is a sample .env file:

```properties
# Required
DATABASE_URL=postgresql://user:password@neonserver.neon.tech/neondb?sslmode=require
# Required - should be the domain with an /xrpc endpoint
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
# React scan key can be omitted
NEXT_PUBLIC_REACT_SCAN_API_KEY="key"
# Required
UPLOADTHING_TOKEN="token"
```

This file should be placed at the path `apps/web/.env`. You may also need to copy this file to `packages/models/.env` so that the database migrations apply properly.