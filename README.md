# MyContact - Gestionnaire de Contacts

Ce projet est une application web full-stack permettant aux utilisateurs de s'inscrire, de se connecter et de gérer une liste de contacts personnels.

## Fonctionnalités

-   **Authentification :** Inscription et connexion des utilisateurs avec JWT (JSON Web Tokens).
-   **Gestion de contacts (CRUD) :**
    -   **C**reate : Ajouter de nouveaux contacts.
    -   **R**ead : Afficher la liste des contacts de l'utilisateur connecté.
    -   **U**pdate : Modifier les informations d'un contact existant.
    -   **D**elete : Supprimer un contact.
-   **API RESTful** construite avec Node.js et Express.
-   **Base de données** MongoDB avec Mongoose.
-   **Frontend** réactif construit avec React.

## Prérequis

-   [Node.js](https://nodejs.org/) (v16 ou supérieure)
-   [npm](https://www.npmjs.com/)
-   [MongoDB](https://www.mongodb.com/try/download/community) (ou un compte MongoDB Atlas)

## Installation et Lancement

1.  **Cloner le dépôt**
    ```bash
    git clone <url-du-repo>
    cd Mycontact
    ```

2.  **Installer les dépendances du backend**
    ```bash
    npm install
    ```

3.  **Installer les dépendances du frontend**
    ```bash
    npm install --prefix react-app
    ```

4.  **Configuration de l'environnement**
    Créez un fichier `.env` à la racine du projet et ajoutez les variables suivantes :
    ```
    MONGODB_URI=mongodb://localhost:27017/mycontactdb
    JWT_SECRET=votre_secret_jwt_super_secret
    PORT=3000
    ```

5.  **Lancer l'application (Backend + Frontend)**
    La commande suivante lancera le serveur Node.js et le serveur de développement React simultanément.
    ```bash
    npm run dev
    ```
    -   Le backend sera accessible sur `http://localhost:3000`.
    -   Le frontend sera accessible sur `http://localhost:3001`.

## Scripts Disponibles

-   `npm run dev`: Lance le backend et le frontend en mode développement.
-   `npm run server`: Lance uniquement le serveur backend avec `nodemon`.
-   `npm run client`: Lance uniquement l'application frontend React.
-   `npm test`: Exécute les tests unitaires du backend avec Jest.

## Endpoints de l'API

Toutes les routes de contacts nécessitent un token JWT dans le header `Authorization: Bearer <token>`.

| Méthode | Endpoint              | Description                               | Accès   |
| :------ | :-------------------- | :---------------------------------------- | :------ |
| `POST`  | `/auth/register`      | Inscription d'un nouvel utilisateur.      | Public  |
| `POST`  | `/auth/login`         | Connexion d'un utilisateur.               | Public  |
| `GET`   | `/contacts`           | Récupère tous les contacts de l'utilisateur. | Privé   |
| `POST`  | `/contacts`           | Ajoute un nouveau contact.                | Privé   |
| `PUT`   | `/contacts/:id`       | Met à jour un contact spécifique.         | Privé   |
| `DELETE`| `/contacts/:id`       | Supprime un contact spécifique.           | Privé   |

## Identifiants de Test

Pour tester l'application manuellement, vous pouvez utiliser les identifiants suivants après avoir lancé l'application :

-   **Email :** `test@example.com`
-   **Mot de passe :** `password123`

*(Ces identifiants seront créés lors de la première exécution des tests ou vous pouvez les enregistrer manuellement via l'interface d'inscription).*
