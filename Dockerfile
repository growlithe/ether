FROM node:latest

RUN mkdir /src

RUN npm install nodemon -g

COPY . /src
COPY .env /src/.env

WORKDIR /src

EXPOSE 3000

CMD npm start