# TRT Conseil - Plateforme de Recrutement

TRT Conseil est une application web de recrutement qui connecte les recruteurs et les candidats dans le secteur de l’hôtellerie et la restauration.

## Configuration Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- Node.js
- npm (généralement inclus avec Node.js)
- MySQL (ou une base de données compatible avec Sequelize)

## Installation Locale

Suivez ces étapes pour mettre en place l'environnement de développement local :

### Étape 1 : Clonage du dépôt

Clonez le dépôt sur votre machine locale en utilisant la commande suivante :

```bash
git clone https://github.com/Ben0813/TRTConseil.git
cd TRTConseil/back
```

### Étape 2 : Installation des dépendances

Installez les dépendances Node.js nécessaires en exécutant :

```bash
npm install
```

### Étape 3 : Configuration de la base de données

Créez une base de données MySQL et configurez les paramètres de connexion dans un fichier `.env` à la racine de votre projet. Voici un exemple de contenu pour le fichier `.env` :

```plaintext
DB_HOST=localhost
DB_USER=yourusername
DB_PASS=yourpassword
DB_NAME=trtconseil_db
JWT_SECRET=yourjwtsecret
SESSION_SECRET=votre_secret_de_session
EMAIL_USER=votre_email_gmail
EMAIL_PASS=Votre_mot_de_passe
```

### Étape 4 : Démarrage du serveur

Démarrage du serveur backend Vous pouvez démarrer le serveur backend en exécutant la commande suivante : node server.js (Lors du premier démarrage du serveur, dans le fichier app.js, vous devez passer les valeurs de "false" à "true" dans la fonction createTables. Cela synchronisera les modèles avec Sequelize.)

Une fois les models synchronisés, n'oubliez pas de retablir les valeurs à false!

```bash
node server.js
```

L'application devrait maintenant être en cours d'exécution sur `http://localhost:3001`.

#### Front-end

Naviguez vers le dossier `front` et installez les dépendances :

```bash
cd TRTConseil/front
npm install
```

### Configurer le Front-end

Ajoutez le dossier .env à la racine du projet et ajouter en valeur l'URL de votre API back-end à votre variable d'environement "VITE_REACT_APP_API_URL="

### Démarrer l'application

Pour démarrer l'application front-end, exécutez :

```bash
npm run dev
```

## Utilisation

Une fois l'application lancée, vous pouvez y accéder depuis un navigateur web pour tester les différentes fonctionnalités.

## Contributions

Les contributions sont les bienvenues.

---

Bonne chance avec votre plateforme de recrutement TRT Conseil !
