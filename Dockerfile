# STAGE 1: Build frontend
FROM node:8.11.2-alpine AS build

# Install Vue app dependencies
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install --no-optional

# Copy and build the app
COPY . .
RUN npm run build

# STAGE 2: Serve the app
FROM nginx:1.14.0-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /webapp
