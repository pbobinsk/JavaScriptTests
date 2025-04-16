FROM node:23-slim

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
