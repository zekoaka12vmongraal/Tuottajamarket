
FROM node:20

WORKDIR /app

# Kopioi backend package.json
COPY package*.json ./

# Asenna backendin riippuvuudet
RUN npm install

# Kopioi koko projektin
COPY . .

# Rakenna frontend
RUN cd frontend && npm install && npm run build

# Kopioi frontendin build backendin dist-kansioon
RUN mkdir -p dist && cp -r frontend/dist/* dist/

EXPOSE 3000

CMD ["node", "server.js"]
