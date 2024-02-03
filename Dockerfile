FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

RUN mkdir data || true

EXPOSE 3000
VOLUME /usr/src/app/data

# NPM doesn't pass SIGTERM from OS, using direct launch
CMD [ "node", "dist/main.js" ]
