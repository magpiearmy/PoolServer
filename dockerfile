FROM node:7
WORKDIR /app
COPY package.json /app
RUN npm install
COPY src /app/src
CMD npm start
EXPOSE 8080
