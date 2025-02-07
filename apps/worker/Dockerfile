FROM oven/bun

WORKDIR /usr/src/app

COPY --from=node:22 /usr/local/bin/node /usr/local/bin/node
COPY . .

RUN bun install
RUN bun run build --filter=@atcast/worker

RUN rm -rf ./node_modules 

RUN bun install --production

WORKDIR /usr/src/app/apps/worker

CMD [ "bun", "start" ]
