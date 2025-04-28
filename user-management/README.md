npx nodemon app.js

docker-compose up --build

docker build -t user-management-node:latest .

docker stack deploy -c swarm.yml myapp

docker run --rm -it --name node-app-container -p 3000:3000 -e PORT=3000 -e MONGODB_URI=mongodb://host.docker.internal:27017/usersdb user-management-node

