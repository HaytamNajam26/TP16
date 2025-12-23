import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_COMPTES } from '../graphql/queries';

const CompteList = () => {
  const { loading, error, data } = useQuery(GET_ALL_COMPTES, {
    errorPolicy: 'all',
  });

  if (loading)
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Liste des Comptes</h2>
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  if (error) {
    console.error('Erreur GraphQL:', error);
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Liste des Comptes</h2>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <h3 className="font-bold mb-2">Erreur de connexion</h3>
          <p>Impossible de se connecter au serveur GraphQL.</p>
          <p className="text-sm mt-2">Erreur : {error.message}</p>
          <p className="text-sm mt-1">
            Assurez-vous que le serveur GraphQL est démarré sur /graphql
          </p>
        </div>
      </div>
    );
  }

  if (!data || !data.allComptes) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Liste des Comptes</h2>
        <p className="text-gray-600">Aucun compte disponible.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Liste des Comptes</h2>
      {data.allComptes.length === 0 ? (
        <p className="text-gray-600">Aucun compte trouvé.</p>
      ) : (
        <div className="space-y-4">
          {data.allComptes.map((compte) => (
            <div
              key={compte.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow"
            >
              <p className="font-semibold">ID: {compte.id}</p>
              <p className="text-lg font-bold text-blue-600">
                Solde: {compte.solde}€
              </p>
              <p className="text-sm text-gray-600">
                Date de création:{' '}
                {new Date(compte.dateCreation).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">Type: {compte.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompteList;


