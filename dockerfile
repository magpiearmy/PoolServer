FROM node:7
WORKDIR /app
COPY package.json /app
RUN npm install
COPY src /app/src
EXPOSE 8082

CMD npm start

