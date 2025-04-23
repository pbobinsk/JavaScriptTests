# Użyj oficjalnego obrazu Node.js w wersji LTS (Long Term Support) Alpine (mały rozmiar)
FROM node:18-alpine

# Ustaw katalog roboczy w kontenerze
WORKDIR /usr/src/app

# Skopiuj plik aplikacji do katalogu roboczego
COPY server.js .

# Poinformuj Docker, że kontener będzie nasłuchiwał na porcie 3000
EXPOSE 3000

# Komenda do uruchomienia aplikacji przy starcie kontenera
CMD [ "node", "server.js" ]