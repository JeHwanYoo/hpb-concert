FROM node:current-alpine

WORKDIR /usr/src/app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/main"]
