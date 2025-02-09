FROM node:lts-alpine3.20

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json ./

RUN chown -R node:node /home/node/app

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

RUN npx prisma generate

RUN npx prisma migrate deploy

RUN npm run build

CMD ["node", "dist/src/index.js"]