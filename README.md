# Greentrip Frontend

**GreenTrip**, l'application pour découvrir des voyages écologiques et des parcours en plein air respectueux de l'environnement.

## Parlons voyages écologiques !

L'application GreenTrip est destinée à un large public souhaitant explorer la nature de manière responsable. Elle s'adresse particulièrement aux randonneurs, cyclistes, et passionnés de voyages verts. Elle propose des itinéraires de randonnée, des road trips à vélo, ainsi que des suggestions d'hébergements et d'activités respectueuses de l'environnement.

GreenTrip permet aux utilisateurs de planifier leurs voyages en fonction de critères comme la durée, la difficulté, le terrain, et la météo. Elle fournit également des informations en temps réel sur la météo et propose des recommandations de points d'intérêt sur la route, des hébergements écologiques et des équipements adaptés à chaque type de voyage.

## Présentation

![GreenTrip](https://user-images.githubusercontent.com/123456789/greentrip-presentation.png)

Ou regardez une courte démo vidéo :

[![GreenTrip Video Demo](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)


## Fonctionnalités principales :

- **Carte interactive** : Visualisez les itinéraires sur une carte dynamique (avec Mapbox).
- **Login** : Sécurise l'accès à l'application via un système de connexion et d'inscription pour les utilisateurs.

## Construit avec

Cette section liste les principaux frameworks et bibliothèques utilisés pour démarrer le projet.

- **Frontend** : React, Mapbox, TailwindCSS, React Router
- **Backend** : Node.js, MySQL
- **Base de données** : MySQL
- **Cartes interactives** : Mapbox GL JS
- **Conteneurisation** : Docker et Docker Compose

---
## Manuel d'installation et d'utilisation

1. Install dependencies:
    ```sh
    npm install
    ```

2. Install Git LFS:
    ```sh
    git lfs install
    ```

3. Start the development server:
    ```sh
    npm run dev
    ```
## Conteneurisation avec Docker

Ce projet peut être facilement exécuté dans un conteneur Docker. Pour ce faire, suivez les étapes ci-dessous :

1. Assurez-vous que Docker est installé sur votre machine. Vous pouvez télécharger Docker [ici](https://www.docker.com/).

2. Construisez l'image Docker pour le frontend et le backend en exécutant les commandes suivantes :

Lancez les conteneurs avec ces commandes :
```bash
./gradlew build
```

```bash
docker compose up --build
```

## Project Structure

- `src/`: Source code of the application
- `public/`: Public assets

## Contributing

Les contributions sont ce qui fait la richesse de ce projet. Si vous avez une idée pour améliorer GreenTrip, n'hésitez pas à contribuer !

1. Forkez le dépôt.
2. Créez une branche pour votre fonctionnalité : (`git checkout -b feature-branch`)
3. Faites vos modifications et validez-les : (`git commit -am 'Add new feature'`)
4. Poussez vos changements : (`git push origin feature-branch`)
5. Ouvrez une pull request pour discuter de vos modifications.

Merci de contribuer à l'amélioration de GreenTrip !

## License

This project is licensed under the Apache License.

## Auteurs

- **Sylvain Costes**
- **Arezki Bazizi**
- **Perle Nkounkou**
- **Riad Kacem**

