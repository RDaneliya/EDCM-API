FROM node:lts-alpine as node_build
RUN npm install -g npm
RUN apk add --update --no-cache curl py-pip
RUN apk add g++ make
WORKDIR /usr/src/build
COPY package*.json ./
RUN npm install

FROM node:lts-alpine
WORKDIR /usr/src/app
COPY --from=node_build /usr/src/build /usr/src/app
COPY . .
ENV MONGO_LINK=${MONGO_LINK}
EXPOSE 9500
CMD ["npm", "start"]