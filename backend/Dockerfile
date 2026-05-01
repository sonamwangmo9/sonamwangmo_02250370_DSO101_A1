FROM node:18-alpine
<<<<<<< HEAD

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

=======
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
>>>>>>> 0ed9112836d8b27adf2f0727e50278f9fc65ba61
CMD ["node", "server.js"]