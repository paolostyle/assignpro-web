# STAGE 1: Build frontend
FROM node:10.14.2-alpine AS build

# Install Vue app dependencies
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Copy and build the app
COPY . .
RUN yarn build

# STAGE 2: Serve the app
FROM nginx:1.14.2-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /webapp
