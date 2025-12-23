# Serveur GraphQL

Serveur GraphQL pour l'application de gestion des comptes et transactions.

## Installation

```bash
npm install
```

## Démarrage

```bash
npm start
```

Le serveur GraphQL sera accessible sur `http://localhost:4000/graphql`

## Fonctionnalités

- Gestion des comptes (création, suppression, consultation)
- Gestion des transactions (dépôts, retraits)
- Statistiques (soldes totaux, statistiques de transactions)
- Stockage en mémoire (les données sont perdues au redémarrage)

## Endpoints GraphQL

- **Queries:**
  - `allComptes`: Récupère tous les comptes
  - `compteById(id)`: Récupère un compte par ID
  - `findCompteByType(type)`: Récupère les comptes par type
  - `totalSolde`: Calcule les statistiques de solde
  - `allTransactions`: Récupère toutes les transactions
  - `compteTransactions(id)`: Récupère les transactions d'un compte
  - `transactionStats`: Récupère les statistiques de transactions

- **Mutations:**
  - `saveCompte(compte)`: Crée un nouveau compte
  - `deleteCompte(id)`: Supprime un compte
  - `addTransaction(transactionRequest)`: Ajoute une transaction

