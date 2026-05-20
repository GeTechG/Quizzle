FROM oven/bun:1-alpine AS build

RUN apk add --no-cache nodejs yarn

WORKDIR /quizzle

COPY ./package.json ./package.json
COPY ./webui/package.json ./webui/package.json

RUN yarn install
RUN cd webui && yarn install

COPY ./webui ./webui
COPY ./server ./server
COPY ./content ./content

RUN cd webui && NODE_OPTIONS="--max-old-space-size=4096" bun run build
RUN mv /quizzle/webui/dist /quizzle/dist

FROM oven/bun:1-alpine

RUN apk add --no-cache tzdata nodejs yarn

ENV NODE_ENV=production
ENV TZ=Etc/UTC

WORKDIR /quizzle

COPY --from=build /quizzle/dist /quizzle/dist
COPY --from=build /quizzle/server /quizzle/server
COPY --from=build /quizzle/content /quizzle/content
COPY --from=build /quizzle/package.json /quizzle/package.json

RUN yarn install --production

VOLUME ["/quizzle/data"]

EXPOSE 6412

CMD ["bun", "run", "server/index.js"]