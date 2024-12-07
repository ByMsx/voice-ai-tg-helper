FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install && yarn cache clean

COPY . .

RUN yarn build

RUN mkdir data || true

EXPOSE 3000
VOLUME /usr/src/app/data

RUN chown node:root /usr/src/app/data
USER node

# NPM doesn't pass SIGTERM from OS, using direct launch
CMD yarn migration:run && node dist/main
