# How to build this image
# docker build -t artefacts.list.lu/hatch/vfesk:tag .

# How to push on arterfacts.list.lu
# docker push artefacts.list.lu/hatch/vfesk:tag

# How to run this image
# docker run -it --name vfesk --rm -p 8080:80 artefacts.list.lu/hatch/vfesk:tag
# You also must include some env variables with the -e

# Don't forget to replace :tag with something else or just remove it. 

# Note: for HTTPS deployement see docker-compose.yml

# Stage 1 - build the VueJS application
FROM node:fermium-alpine as build

# Set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk add --no-cache make build-base

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npx browserslist@latest --update-db  

# Reinstall the node packages based on the package-lock.json (+remove old node_modules)
RUN npm ci

# Copy everything over to the Docker environment
COPY . .

# Build the application (+ some optimizations)
RUN npm run build

# Stage 2 - copy the previously builded files and create the final Docker image
# nginx >= 1.19 - new features: environment variables and templates support. 
FROM nginx:1.19-alpine

RUN apk add --no-cache bash

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY nginx/docker-entrypoint.d/* /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/*.sh

# Remove the default.conf file to ensure its creation from a template file.
RUN rm /etc/nginx/conf.d/default.conf

# Copy the conf templates, can be overrided with a volume (only http.conf and https.conf are required)
COPY nginx/templates/* /etc/nginx/templates/

# COPY nginx/certs/self-signed.key /etc/nginx/private/self-signed.key
# COPY nginx/certs/self-signed.cert /etc/nginx/certs/self-signed.cert

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]

#docker build -t frontend .
#docker tag frontend artefacts.list.lu/erin-sia/ddc/frontend:latest
#docker push artefacts.list.lu/erin-sia/ddc/frontend:latest
