# Image to be able to install and compile node packages (i.e. node-gyp)
FROM node:8 as base

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY package*.json ./

RUN npm install --production

COPY --chown=node:node . .


# Runtime image
FROM node:8-alpine

RUN apk --update --no-cache add curl

USER node

WORKDIR /home/node/app

COPY --chown=node:node --from=base /home/node/app .

ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT
ENV NODE_ENV=prod

HEALTHCHECK --interval=1m --timeout=5s --start-period=1m \
   CMD curl -f http://localhost:8080/api/healthcheck || exit 1

EXPOSE 8080

CMD [ "node", "index.js" ]