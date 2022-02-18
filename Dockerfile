FROM node:lts-alpine as node_build
RUN npm install -g npm
RUN apk add --update --no-cache \
    py-pip \
    g++ \
    make
WORKDIR /build
COPY --chown=node:node package*.json ./
RUN npm install

FROM node:lts-alpine
ENV APP_ROOT /app
RUN addgroup --gid 9999 --system edcm \
    && adduser --uid 9999 --system edcm edcm \
    && mkdir --parents ${APP_ROOT} \
    && chown --recursive edcm:edcm ${APP_ROOT}
USER edcm
WORKDIR ${APP_ROOT}
COPY --chown=edcm:edcm  --from=node_build /build ./
COPY --chown=edcm:edcm . ./
ENV MONGO_LINK=${MONGO_LINK}
ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80
EXPOSE 9500
CMD ["node", "bin/www.mjs"]
