FROM node:18-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENV PORT=3000

EXPOSE ${PORT}

CMD [ "node", "app.js" ]
