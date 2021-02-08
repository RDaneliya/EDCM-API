FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV MONGO_LINK=${MONGO_LINK}
EXPOSE 9500
CMD ["npm", "start"]