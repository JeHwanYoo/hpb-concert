FROM public.ecr.aws/docker/library/node:21-alpine as base

WORKDIR /app

RUN corepack enable

FROM base as pacakge

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM base as build

COPY --from=pacakge /app/node_modules ./node_modules
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./

COPY src ./src
COPY prisma ./prisma

RUN pnpx prisma generate
RUN pnpm build

EXPOSE 3000

CMD node dist/main
