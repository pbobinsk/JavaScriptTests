docker compose up --build -d

docker compose down

docker compose up vue-app


Bez compose:
docker build -t vue-app-test ./vue-app
docker build -t react-app-test ./react-app
docker build -t angular-app-test ./angular-app

docker run -p 5173:5173 vue-app-test
docker run -p 5174:5174 react-app-test
docker run -p 4200:4200 angular-app-test

docker stack deploy -c swarm.yml moja_apka
docker stack rm moja_apka
