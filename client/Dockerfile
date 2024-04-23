# Build stage
FROM node:20.11.0-alpine as build

WORKDIR /app

ENV GENERATE_SOURCEMAP=false

COPY package.json .

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

# Production stage
FROM node:20.11.0-alpine as prod

COPY --from=build /app/package.json /app/

COPY --from=build /app/dist /app/build/

WORKDIR /app

RUN npm install -g serve 

EXPOSE 5173:5173

CMD ["serve", "-s", "build", "-l", "5173"]