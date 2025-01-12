#build stage for serverrrrrrrrr
FROM node:18-alpine
WORKDIR /usr/src/deplo
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]