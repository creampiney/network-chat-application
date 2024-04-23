FROM node:20.11.0-alpine

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm prisma generate

RUN pnpm run build

CMD ["pnpm", "run", "start"]