<div align="center">

# OpenClassrooms - Eco-Bliss-Bath
</div>

<p align="center">
    <img src="https://img.shields.io/badge/MariaDB-v11.7.2-blue">
    <img src="https://img.shields.io/badge/Symfony-v6.2-blue">
    <img src="https://img.shields.io/badge/Angular-v13.3.0-blue">
    <img src="https://img.shields.io/badge/Cypress-v14.5.4-blue">
    <img src="https://img.shields.io/badge/docker--build-passing-brightgreen">
    <img src="https://img.shields.io/badge/Cypress--tests-notpassing-red">
  <br><br><br>
</p>

# Prérequis
Pour démarrer cet applicatif web vous devez avoir les outils suivants:
- Docker
- NodeJs
- Cypress

# Installation et démarrage
Clonez le projet pour le récupérer
``` 
git clone https://github.com/OpenClassrooms-Student-Center/Eco-Bliss-Bath-V2.git
cd Eco-Bliss-Bath-V2
```
Pour démarrer l'API avec sa base de données.
```
docker compose up -d
```
# Pour démarrer le frontend de l'applicatif
Rendez-vous dans le dossier frontend
```
cd ./frontend
```
Installez les dépendances du projet
```
npm i
ou
npm install 
```
Démarrez le frontend du projet
```
npm run start 
```
# Démarrez l'outil de test Cypress <br>
*Les dépendances du projet doivent être installées* 

Pour démarrer le client Cypress
```
npm run cy:open
```
Pour démarrer les tests e2e dans Chrome, en headless <br>
*Nécessite au moins 1 test e2e existant*
```
npm run e2e:chrome
```


