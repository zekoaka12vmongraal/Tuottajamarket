# Käytetään Node 18 -ympäristöä
FROM node:18

# Aseta työkansio
WORKDIR /app

# Kopioi backendin package-tiedostot
COPY package*.json ./

# Asenna backendin riippuvuudet
RUN npm install

# Kopioi frontend-kansio
COPY frontend ./frontend

# Asenna frontendin riippuvuudet ja buildaa
RUN cd frontend && npm install && npm run build

# Kopioi frontin build backendin dist-kansioon
RUN mkdir -p dist
RUN cp -r frontend/dist/* dist/

# Kopioi loput projektista (data, services, server.js, jne.)
COPY . .

# Altista portti (Render käyttää yleensä 10000 mutta tämä ei haittaa)
EXPOSE 3000

# Käynnistä backend
CMD ["node", "server.js"]