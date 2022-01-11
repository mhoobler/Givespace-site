FROM node:latest AS buildclient

WORKDIR /usr/src/app
COPY ./client ./client

WORKDIR /usr/src/app/client
RUN yarn && yarn build

FROM node:latest

WORKDIR /usr/src/app
COPY ./server ./server
COPY --from=buildclient /usr/src/app/client/build ./client

WORKDIR /usr/src/app/server
RUN yarn && yarn tsc

ENTRYPOINT ["node", "./dist/index.js"]

