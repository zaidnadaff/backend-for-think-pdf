FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY server.js ./
COPY app ./app
COPY uploads ./uploads

EXPOSE 3000

CMD ["node", "server.js"]