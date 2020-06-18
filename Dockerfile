# Dockerfile (tag: v3)
FROM node:10.15.3
RUN npm install webpack -g
WORKDIR /tmp
COPY package.json /tmp/
RUN npm config set registry http://registry.npmjs.org/ && npm install
WORKDIR /usr/src/app
COPY . /usr/src/app/
COPY www /usr/src/app/www
RUN cp -a /tmp/node_modules /usr/src/app/
RUN webpack
ENV NODE_ENV=development
ENV PORT=3000
CMD [ "npm", "start" ]
EXPOSE 3000