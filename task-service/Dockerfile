FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src/ ./src/

ENV USERS_SERVICE_URL=http://user-service

EXPOSE 3000
CMD ["node", "src/index.js"]