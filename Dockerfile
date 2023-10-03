FROM node:16.13.2-alpine3.14

# create app directory in container
RUN mkdir -p /app

# set /app directory as default working directory
WORKDIR /app

COPY dist ./dist
COPY node_modules ./node_modules

EXPOSE 4000

# cmd to start service
CMD [ "node", "dist/index.js"]
