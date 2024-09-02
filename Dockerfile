FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g typescript

EXPOSE 3000

CMD ["npm", "run", "dev"]