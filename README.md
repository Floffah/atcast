# AtCast

Proof-of-concept podcast distribution platform for the AtProto.

## Design Choices

### File upload

The AtCast lexicons and backend support up to 20MB of audio data per episode. This is to ensure that the PDS can handle the data without slowing down.

The 20MB is modeled after 60 minutes of 30kbps 48khz audio compressed in OPUS format. If necessary, this may be increased in the future.

AtCast does **not** expect changes of the `audio` property of records following the `live.atcast.show.episode` lexicon unless edited by AtCast itself. This will be changed in the future.

Currently, AtCast has two services: the website and the worker service. The worker service currently is only responsible for compressing and re-encoding the audio files to OPUS format. In the future, this worker will also generate HLS streams for the audio files.

### Podcast model

An AtProto account its self is considered as the brand for the show, a single account cannot create multiple shows. To own multiple shows, the user must have a unique handle for each. Profiles and information are currently derived from the app.bsky.actor.profile lexicon.

## Setup

When running yourself, it is as simple as ensuring you have Bun installed and the appropriate environment variables. Here is a sample .env file:

```properties
# Required
DATABASE_URL=postgresql://user:password@neonserver.neon.tech/neondb?sslmode=require
# Required - should be the domain with an /xrpc endpoint
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
# Required
UPLOADTHING_TOKEN="token"
# Required
UPLOADTHING_HOST="your_account_id.ufs.sh"
# React scan key can be omitted
NEXT_PUBLIC_REACT_SCAN_API_KEY="key"
```

This file should be placed at the paths `apps/web/.env` and `apps/worker/.env`. You may also need to copy this file to `packages/models/.env` so that the database migrations apply properly.