## Docker

You can also use docker for development. Make sure you run npm install on your host machine so that code linting and everything works fine.

```sh
npm i
cp .env.example .env
```

Start the services

```sh
docker-compose build
docker-compose up -d
```
to see inside docker what files are available

```sh
docker exec -it e-commerce-api-docker /bin/bash
cd /app
ls -l


```

View the logs

```sh
docker-compose down
docker-compose up --build
docker-compose logs -f
```

In case you install a npm module while developing, it should also be installed within docker container, to do this first install the module you want with simple `npm i module name`, then run it within docker container

```sh
docker-compose exec node npm i
```

If you make any changes to the file, nodemon should automatically pick up and restart within docker (you can see this in the logs)

To run tests

```sh
docker-compose exec -e MONGODB_URL=mongodb://mongo:27017/noobjs_test node npm test
```
To create admin seed user

```sh
node app/seeders/userSeeder.js
node app/seeders/db-seed.js
```

To start MongoDB Server in Linux/Ubuntu
```sh
sudo systemctl start mongod
```

Note that we are overriding the environment variable set in `.env` file because we don't want our data erased by the tests.

Note: The difference between exec and run is that, exec executes the command within the running container and run will spin up a new container to run that command. So if you want to run only the tests without docker-compose up, you may do so by running `docker-compose run -e MONGODB_URL=mongodb://mongo:27017/my_app_test node npm test`