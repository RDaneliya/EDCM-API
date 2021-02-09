FROM node:15
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV MONGO_LINK=${MONGO_LINK}
EXPOSE 9500
CMD ["node", "app.js"]