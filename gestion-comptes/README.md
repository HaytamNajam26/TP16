# Gestion des Comptes et Transactions - Application React

## Description
Application React complète pour la gestion de comptes bancaires et de transactions utilisant GraphQL et Apollo Client.

## Fonctionnalités
✅ Création de comptes (Courant/Épargne)  
✅ Affichage de la liste des comptes  
✅ Suppression de comptes  
✅ Ajout de transactions (Dépôt/Retrait)  
✅ Historique des transactions  
✅ Interface responsive avec Tailwind CSS

## Technologies utilisées
- **React** - Framework JavaScript pour l'interface utilisateur
- **Apollo Client** - Gestion des données GraphQL
- **GraphQL** - Langage de requête pour l'API
- **Tailwind CSS** - Framework CSS pour le design

## Installation

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet :**
```bash
cd gestion-comptes
```

2. **Installer les dépendances :**
```bash
npm install
```

3. **Lancer l'application :**
```bash
npm start
```

L'application sera accessible à l'adresse : **http://localhost:3000**

## Structure du projet

```
gestion-comptes/
├── src/
│   ├── apollo/
│   │   └── client.js          # Configuration Apollo Client
│   ├── components/
│   │   ├── CompteList.js      # Liste des comptes
│   │   ├── CreateCompte.js    # Formulaire de création de compte
│   │   ├── TransactionForm.js # Formulaire de transaction
│   │   └── TransactionList.js # Historique des transactions
│   ├── graphql/
│   │   ├── mutations.js       # Mutations GraphQL
│   │   ├── queries.js         # Requêtes GraphQL
│   │   ├── types.js           # Énumérations
│   │   └── interfaces.ts      # Interfaces TypeScript
│   ├── App.js                 # Composant principal
│   ├── index.js               # Point d'entrée
│   └── index.css              # Styles globaux
├── tailwind.config.js         # Configuration Tailwind
├── postcss.config.js          # Configuration PostCSS
└── package.json               # Dépendances du projet
```

## Utilisation

### Créer un compte
1. Remplir le formulaire "Créer un Compte"
2. Entrer le solde initial
3. Sélectionner le type de compte (Courant ou Épargne)
4. Cliquer sur "Créer un compte"

### Effectuer une transaction
1. Sélectionner un compte dans le formulaire "Formulaire de Transaction"
2. Choisir le type de transaction (Dépôt ou Retrait)
3. Entrer le montant
4. Cliquer sur "Effectuer un Dépôt" ou "Effectuer un Retrait"

### Consulter les comptes et transactions
- La liste des comptes s'affiche automatiquement dans la colonne de gauche
- L'historique des transactions apparaît dans la colonne de droite

## Configuration GraphQL

⚠️ **IMPORTANT** : Cette application nécessite un serveur GraphQL backend.

### Configuration de l'URL du serveur
L'URL de l'API GraphQL est configurée dans le fichier `src/apollo/client.js` :

```javascript
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});
```

Par défaut, l'application se connecte à **http://localhost:4000/graphql**.

### Démarrage complet

**Étape 1 : Démarrer le serveur GraphQL backend**

Le serveur GraphQL se trouve dans le dossier `../graphql-server/` :

```bash
cd ../graphql-server
npm install
npm start
```

Le serveur GraphQL sera accessible sur **http://localhost:4000/graphql**

**Étape 2 : Démarrer l'application React**

```bash
cd gestion-comptes
npm start
```

L'application React sera accessible sur **http://localhost:3000**

## Schéma GraphQL Requis

Le serveur backend doit implémenter les requêtes et mutations définies dans `src/graphql/`.

### Requêtes principales :
- `allComptes` - Liste tous les comptes
- `allTransactions` - Liste toutes les transactions
- `compteById(id)` - Récupère un compte par ID
- `totalSolde` - Statistiques des soldes
- `compteTransactions(id)` - Récupère les transactions d'un compte
- `transactionStats` - Statistiques des transactions

### Mutations principales :
- `saveCompte(compte)` - Crée un compte
- `deleteCompte(id)` - Supprime un compte
- `addTransaction(transactionRequest)` - Ajoute une transaction

### Vérification de la connexion

Pour vérifier que le serveur GraphQL fonctionne :

```bash
# Tester la connexion
curl http://localhost:4000/graphql

# Tester une requête
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ allComptes { id solde type } }"}'
```

## Configuration CORS

Le serveur backend doit autoriser les requêtes depuis **http://localhost:3000**.

Le serveur GraphQL fourni dans `../graphql-server/` est déjà configuré avec CORS pour accepter les requêtes depuis `localhost:3000`.

## Scripts disponibles

### `npm start`
Runs the app in the development mode.  
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.  
You may also see any lint errors in the console.

### `npm test`
Launches the test runner in the interactive watch mode.  
See the section about running tests for more information.

### `npm run build`
Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

See the section about deployment for more information.

## Démonstration

<!-- Ajouter les captures d'écran ici -->

## Évaluation
✅ Fonctionnalité des composants  
✅ Utilisation correcte d'Apollo Client  
✅ Esthétique de l'interface avec Tailwind CSS  
✅ Gestion des erreurs  
✅ Respect des bonnes pratiques React

## Auteur
Projet développé dans le cadre d'un exercice de développement React avec GraphQL.

## License
MIT
