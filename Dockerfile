#==========[ BASE ]==========#
FROM node:16.13.1-alpine as base
WORKDIR /app
# Copy only package files and install dependencies packages, before bring all the source code
COPY package*.json ./
RUN npm ci --unsafe-perm

COPY . .

#==========[ DEV ]==========#
# Development image, used for local develop only.
# The source code will be bind-mount in docker-compose.yaml file to "src" folder

FROM base as dev
ENTRYPOINT [ "npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "80", "--disable-host-check" ]

#==========[ BUILD ]==========#
FROM base as builder
RUN npm run build

#==========[ FINAL ]==========#
FROM nginx:alpine as final
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy minimal config file to support SPA
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
# Add a script to run when container startup (alvailable since nginx 1.19)
COPY deploy/docker.replace-env.sh /docker-entrypoint.d
# Save version into
ARG SIMCEL_VERSION=local
ENV SIMCEL_VERSION=$SIMCEL_VERSION
