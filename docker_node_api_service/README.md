1.
node.exe .\serwer.js

2.
docker build -t my-node-service .
docker run --name moje-api -d -p 3000:3000  my-node-service

UWAGA
UWAGA:
docker network create moja-siec
docker run --name moje-api --network moja-siec -d -p 3000:3000  my-node-service
NODE_API_URL = "http://moje-api:3000/api/data"

docker stop moje-api
docker rm moje-api


3.
docker-compose