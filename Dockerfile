
FROM node:18.12.1-alpine as dist
WORKDIR /tmp/
# RUN apk --no-cache add --virtual builds-deps build-base python
COPY package.json yarn.lock tsconfig.json tsconfig.build.json ./
COPY src/ src/
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN yarn
RUN yarn build

FROM node:18.12.1-alpine as node_modules
WORKDIR /tmp/
# RUN apk --no-cache add --virtual builds-deps build-base python
COPY package.json yarn.lock ./
RUN yarn install --production

FROM node:18.12.1-alpine
WORKDIR /usr/local/nub-api
COPY --from=node_modules /tmp/node_modules ./node_modules
COPY --from=dist /tmp/dist ./dist
CMD exec node --max_old_space_size=4096 dist/main.js