FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prefer-offline --shamefully-hoist

COPY . .

RUN pnpm run build

FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --prefer-offline --shamefully-hoist

COPY --from=builder /app/dist ./dist

# Create uploads folder and permissions
RUN mkdir -p uploads && chown -R node:node uploads

ENV PORT=3010
EXPOSE 3010

CMD ["node", "dist/main"]
