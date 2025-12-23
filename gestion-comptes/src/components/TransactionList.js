import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_TRANSACTIONS } from '../graphql/queries';

const TransactionList = () => {
  const { loading, error, data } = useQuery(GET_ALL_TRANSACTIONS, {
    errorPolicy: 'all',
    pollInterval: 2000, // Rafraîchir toutes les 2 secondes
  });

  if (loading)
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Liste des Transactions</h2>
        <p className="text-gray-600">Chargement...</p>
      </div>
    );

  if (error) {
    console.error('Erreur GraphQL:', error);
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Liste des Transactions</h2>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <h3 className="font-bold mb-2">Erreur de connexion</h3>
          <p>Impossible de charger les transactions.</p>
          <p className="text-sm mt-2">Erreur : {error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.allTransactions) {
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Liste des Transactions</h2>
        <p className="text-gray-600">Aucune transaction disponible.</p>
      </div>
    );
  }

  const transactions = data.allTransactions || [];

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Liste des Transactions</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-600">Aucune transaction trouvée.</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions
            .slice()
            .reverse()
            .map((transaction) => (
              <div
                key={transaction.id}
                className={`p-3 border rounded-lg ${
                  transaction.type === 'DEPOT'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {transaction.type === 'DEPOT' ? '💰 Dépôt' : '💸 Retrait'}
                    </p>
                    <p className="text-lg font-bold">
                      {transaction.type === 'DEPOT' ? '+' : '-'}
                      {transaction.montant}€
                    </p>
                    <p className="text-xs text-gray-600">
                      Compte: {transaction.compte.id} ({transaction.compte.type})
                    </p>
                    <p className="text-xs text-gray-600">
                      Solde après: {transaction.compte.solde}€
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
