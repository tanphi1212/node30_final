FROM node:16

WORKDIR /usr/src/app


COPY package*.json .
COPY prisma ./prisma/

RUN yarn install

COPY . .

RUN yarn run build

# định nghĩa port private (trong)
EXPOSE 8080

# npm start, node src/index.js 
CMD ["yarn","run","start:prod"]

# docker build . -t img-node