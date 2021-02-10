FROM mhart/alpine-node:latest
RUN npm install -g npm
RUN apk add --update --no-cache curl py-pip
RUN apk add g++ make
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./ .
ENV MONGO_LINK=${MONGO_LINK}
EXPOSE 9500
CMD ["npm", "start"]