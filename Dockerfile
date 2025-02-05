FROM node:22.13-alpine
WORKDIR /
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 8001
CMD npm start
