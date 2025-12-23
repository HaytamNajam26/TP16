const { ApolloServer } = require('@apollo/server');
const express = require('express');
const cors = require('cors');
const { json } = require('body-parser');

// Stockage en mémoire
let comptes = [];
let transactions = [];
let nextCompteId = 1;
let nextTransactionId = 1;

// Schéma GraphQL
const typeDefs = `
  enum TypeCompte {
    COURANT
    EPARGNE
  }

  enum TypeTransaction {
    DEPOT
    RETRAIT
  }

  type Compte {
    id: ID!
    solde: Float!
    dateCreation: String!
    type: TypeCompte!
  }

  type Transaction {
    id: ID!
    type: TypeTransaction!
    montant: Float!
    date: String!
    compte: Compte!
  }

  input CompteRequest {
    solde: Float!
    type: TypeCompte!
  }

  input TransactionRequest {
    type: TypeTransaction!
    montant: Float!
    compteId: ID!
  }

  type SoldeStats {
    count: Int!
    sum: Float!
    average: Float!
  }

  type TransactionStats {
    count: Int!
    sumDepots: Float!
    sumRetraits: Float!
  }

  type Query {
    allComptes: [Compte!]!
    compteById(id: ID!): Compte
    findCompteByType(type: TypeCompte!): [Compte!]!
    totalSolde: SoldeStats!
    allTransactions: [Transaction!]!
    compteTransactions(id: ID!): [Transaction!]!
    transactionStats: TransactionStats!
  }

  type Mutation {
    saveCompte(compte: CompteRequest!): Compte!
    deleteCompte(id: ID!): Boolean!
    addTransaction(transactionRequest: TransactionRequest!): Transaction!
  }
`;

// Résolveurs
const resolvers = {
  Query: {
    allComptes: () => comptes,
    compteById: (_, { id }) => comptes.find((c) => c.id === id),
    findCompteByType: (_, { type }) => comptes.filter((c) => c.type === type),
    totalSolde: () => {
      const count = comptes.length;
      const sum = comptes.reduce((acc, c) => acc + c.solde, 0);
      const average = count > 0 ? sum / count : 0;
      return { count, sum, average };
    },
    allTransactions: () => transactions,
    compteTransactions: (_, { id }) =>
      transactions.filter((t) => t.compte.id === id),
    transactionStats: () => {
      const count = transactions.length;
      const sumDepots = transactions
        .filter((t) => t.type === 'DEPOT')
        .reduce((acc, t) => acc + t.montant, 0);
      const sumRetraits = transactions
        .filter((t) => t.type === 'RETRAIT')
        .reduce((acc, t) => acc + t.montant, 0);
      return { count, sumDepots, sumRetraits };
    },
  },
  Mutation: {
    saveCompte: (_, { compte }) => {
      const newCompte = {
        id: String(nextCompteId++),
        solde: compte.solde,
        dateCreation: new Date().toISOString(),
        type: compte.type,
      };
      comptes.push(newCompte);
      return newCompte;
    },
    deleteCompte: (_, { id }) => {
      const index = comptes.findIndex((c) => c.id === id);
      if (index === -1) return false;
      comptes.splice(index, 1);
      transactions = transactions.filter((t) => t.compte.id !== id);
      return true;
    },
    addTransaction: (_, { transactionRequest }) => {
      const compte = comptes.find((c) => c.id === transactionRequest.compteId);
      if (!compte) {
        throw new Error('Compte non trouvé');
      }

      // Mettre à jour le solde du compte
      if (transactionRequest.type === 'DEPOT') {
        compte.solde += transactionRequest.montant;
      } else if (transactionRequest.type === 'RETRAIT') {
        if (compte.solde < transactionRequest.montant) {
          throw new Error('Solde insuffisant');
        }
        compte.solde -= transactionRequest.montant;
      }

      const newTransaction = {
        id: String(nextTransactionId++),
        type: transactionRequest.type,
        montant: transactionRequest.montant,
        date: new Date().toISOString(),
        compte: { ...compte },
      };
      transactions.push(newTransaction);
      return newTransaction;
    },
  },
};

// Créer le serveur Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Démarrer le serveur
async function startServer() {
  await server.start();

  const app = express();

  // Configuration CORS pour accepter les requêtes depuis localhost:3000
  app.use(
    '/graphql',
    cors({
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    }),
    json(),
    async (req, res) => {
      try {
        const { query, variables, operationName } = req.body;
        const result = await server.executeOperation(
          {
            query,
            variables,
            operationName,
          },
          {
            contextValue: { req },
          }
        );
        
        // Formater la réponse au format GraphQL standard
        // Apollo Server 5 retourne result.body.kind === 'single' avec singleResult
        let response;
        if (result.body && result.body.kind === 'single' && result.body.singleResult) {
          response = {
            data: result.body.singleResult.data || null,
            errors: result.body.singleResult.errors || undefined,
          };
        } else {
          // Fallback: utiliser directement result
          response = {
            data: result.data || null,
            errors: result.errors || undefined,
          };
        }
        
        // Ne pas inclure errors si null/undefined (format GraphQL standard)
        if (!response.errors) {
          delete response.errors;
        }
        
        res.status(200).json(response);
      } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({ 
          errors: [{ message: error.message }] 
        });
      }
    }
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur GraphQL démarré sur http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) => {
  console.error('Erreur lors du démarrage du serveur:', error);
});
