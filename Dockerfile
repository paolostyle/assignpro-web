FROM node:lts-alpine

RUN yarn global add http-server

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build:offline

EXPOSE 80
CMD ["http-server", "dist", "-p", "80"]
