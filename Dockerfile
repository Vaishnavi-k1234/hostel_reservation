FROM node:20

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Start the application
CMD [ "node", "server.js" ]