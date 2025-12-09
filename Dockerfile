FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

WORKDIR /app/frontend
RUN npm install
RUN npm run build

WORKDIR /app
RUN mkdir -p dist && cp -r frontend/dist/* dist/

EXPOSE 3000
CMD ["node", "server.js"]
