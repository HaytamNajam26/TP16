import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { SAVE_COMPTE } from '../graphql/mutations';

const CreateCompte = () => {
  const [solde, setSolde] = useState('');
  const [type, setType] = useState('COURANT');
  const [message, setMessage] = useState('');

  const [saveCompte] = useMutation(SAVE_COMPTE, {
    errorPolicy: 'all',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const result = await saveCompte({
        variables: {
          compte: {
            solde: parseFloat(solde),
            type,
          },
        },
        refetchQueries: ['GetAllComptes'],
      });
      if (result.data) {
        setMessage('Compte créé avec succès !');
        setSolde('');
        setType('COURANT');
      }
    } catch (error) {
      console.error('Erreur lors de la création du compte :', error);
      setMessage(
        `Erreur : ${error.message || 'Impossible de créer le compte. Vérifiez que le serveur GraphQL est démarré.'}`
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Créer un Compte</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">
            Solde :
            <input
              type="number"
              value={solde}
              onChange={(e) => setSolde(e.target.value)}
              required
              placeholder="Entrez le solde initial"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            />
          </label>
        </div>
        <div>
          <label className="block mb-2">
            Type :
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="COURANT">Courant</option>
              <option value="EPARGNE">Épargne</option>
            </select>
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Créer un compte
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
    </div>
  );
};

export default CreateCompte;


