<div align="center">

# OpenClassrooms - Eco-Bliss-Bath
</div>

<p align="center">
    <img src="https://img.shields.io/badge/Mysql-v8.0-blue">
    <img src="https://img.shields.io/badge/Symfony-v6.2-blue">
    <img src="https://img.shields.io/badge/Angular-v15.2.0-blue">
    <img src="https://img.shields.io/badge/docker--build-passing-brightgreen">
  <br><br><br>
</p>

# Prerequisites
You need Docker to launch the app
You can find instruction on [Docker website install](https://docs.docker.com/engine/install/)

The most simple will be to install Docker Desktop

# Installation and start
After downloaded project or cloned it, you can start simply like this
``` 
git clone https://github.com/OC-For-Students/Eco-Bliss-Bath-V2.git
cd Eco-Bliss-Bath-V2

docker compose up --build -d

```

# Important
After start command, be sure that all containers are started before go to website.
You can check it with Docker Desktop dashboard, all containers must be to green status

## To close the project after work ;)
Be sure to be in the project folder. Where the docker-compose.yml file is before the following command

```
docker compose down
```

# To work
You can work directly in the frontend folder.
All is synchronized, your modifications and or package installation will be applied automatically

## At the end
When you finish with this project don't forget to clean your system.
All files use no needed space after.

If you use docker for this only project you can clear all data by

```
docker system prune -a
```

For this only one project, you can delete it with Docker Desktop
- Container
- Image
- Volume
