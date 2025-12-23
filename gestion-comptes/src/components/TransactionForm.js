import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { ADD_TRANSACTION } from '../graphql/mutations';
import { GET_ALL_COMPTES, GET_ALL_TRANSACTIONS } from '../graphql/queries';

const TransactionForm = () => {
  const [compteId, setCompteId] = useState('');
  const [type, setType] = useState('DEPOT');
  const [montant, setMontant] = useState('');
  const [message, setMessage] = useState('');

  const { data: comptesData, loading: comptesLoading } = useQuery(
    GET_ALL_COMPTES,
    {
      errorPolicy: 'all',
    }
  );

  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    errorPolicy: 'all',
    refetchQueries: [
      { query: GET_ALL_COMPTES },
      { query: GET_ALL_TRANSACTIONS },
    ],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!compteId) {
      setMessage('Veuillez sélectionner un compte');
      return;
    }

    if (!montant || parseFloat(montant) <= 0) {
      setMessage('Veuillez entrer un montant valide');
      return;
    }

    try {
      const result = await addTransaction({
        variables: {
          transactionRequest: {
            type,
            montant: parseFloat(montant),
            compteId,
          },
        },
      });

      if (result.data) {
        setMessage(
          `Transaction ${type === 'DEPOT' ? 'déposée' : 'retirée'} avec succès !`
        );
        setMontant('');
        setCompteId('');
        setType('DEPOT');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la transaction :', error);
      setMessage(
        `Erreur : ${error.message || 'Impossible de créer la transaction.'}`
      );
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Formulaire de Transaction</h2>
      {comptesLoading ? (
        <p className="text-gray-600">Chargement des comptes...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">
              Compte :
              <select
                value={compteId}
                onChange={(e) => setCompteId(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez un compte</option>
                {comptesData?.allComptes?.map((compte) => (
                  <option key={compte.id} value={compte.id}>
                    {compte.id} - {compte.type} (Solde: {compte.solde}€)
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Type :
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="DEPOT">Dépôt</option>
                <option value="RETRAIT">Retrait</option>
              </select>
            </label>
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Montant (€) :
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                required
                placeholder="Entrez le montant"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              />
            </label>
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              type === 'DEPOT'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {type === 'DEPOT' ? 'Effectuer un Dépôt' : 'Effectuer un Retrait'}
          </button>
          {message && (
            <div
              className={`p-3 rounded-md ${
                message.includes('Erreur')
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {message}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default TransactionForm;
