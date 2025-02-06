# AtCast

Proof-of-concept podcast distribution platform for the AtProto.

## Design Choices

### File upload

The AtCast lexicons and backend support up to 20MB of audio data per episode. This is to ensure that the PDS can handle the data without slowing down.

The 20MB is modeled after 60 minutes of 30kbps 48khz audio compressed in OPUS format. If necessary, this may be increased in the future.

AtCast does not expect the `audio` field of [`live.atcast.show.episode`](./lexicons/live/atcast/show/episode.json) to ever be changed. It will not be set when the record is created, as uploading and encoding is done in the background. These constraints are because AtCast will generate HLS streams from the audio data and store them in the UploadThing repository after the initial upload. If the audio data is changed in the PDS, the HLS streams will be out of sync. AtCast will be upgraded in the future to handle changes and re-generate the HLS streams.

Note that HLS generation is currently not implemented, but in progress. This will require a separate cluster of workers to handle the encoding of the audio data.

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