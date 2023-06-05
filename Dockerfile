FROM node:14

COPY package.json .

RUN npm install\
    && npm install typescript -g

COPY . .

RUN tsc ./server.ts

EXPOSE 8080
EXPOSE 8100

RUN npm run build

CMD ["node", "./server.js"]
