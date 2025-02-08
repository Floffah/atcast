FROM oven/bun:latest as base

FROM base as base-installer
RUN apt update

FROM base-installer as ffmpeg-installer
RUN apt install --no-install-recommends -y ffmpeg

FROM base as runtime
COPY --from=ffmpeg-installer /usr/bin/ffmpeg /usr/bin/ffmpeg
COPY --from=ffmpeg-installer /usr/lib/*-linux-gnu/* /usr/lib/
COPY --from=ffmpeg-installer /lib/*-linux-gnu/* /usr/lib/

COPY --from=node:22 /usr/local/bin/node /usr/local/bin/node

WORKDIR /usr/src/app

COPY . .

RUN bun install
RUN bun run build --filter=@atcast/worker

WORKDIR /usr/src/app/apps/worker

CMD [ "bun", "start" ]
