FROM oven/bun:latest

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
ENV PORT 8080

CMD ["bun", "src/index.ts"]

EXPOSE 8080