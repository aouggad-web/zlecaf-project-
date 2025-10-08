import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://etape-suivante.preview.emergentagent.com';

export default function Health() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/health`, {
          cache: 'no-store'
        });
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(String(err));
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Health — Observabilité</h1>
        <p className="text-gray-600">Chargement…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Health — Observabilité</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">
            Erreur lors de l'appel à <code className="bg-red-100 px-2 py-1 rounded">/api/health</code> : {error}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Health — Observabilité</h1>
        <p className="text-gray-600">Aucune donnée disponible</p>
      </div>
    );
  }

  const ok = data.ok;

  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Health — Observabilité</h1>
      
      <div className={`p-4 rounded-lg ${ok ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div className={ok ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>
          Statut global : <span className="text-lg">{ok ? '✓ OK' : '✗ DEGRADED'}</span>
        </div>
      </div>

      {data.lastUpdated && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <span className="font-semibold">Dernière mise à jour datasets :</span>{' '}
          {new Date(data.lastUpdated).toLocaleString('fr-FR', {
            dateStyle: 'full',
            timeStyle: 'short'
          })}
        </div>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left font-semibold">Fichier</th>
              <th className="p-3 text-left font-semibold">Présence</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.files).map(([name, present]) => (
              <tr key={name} className="border-b last:border-b-0">
                <td className="p-3 font-mono text-xs">{name}</td>
                <td className={`p-3 font-semibold ${present ? 'text-green-600' : 'text-red-600'}`}>
                  {present ? '✔ Disponible' : '✖ Manquant'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <p className="mb-1">
          <span className="font-semibold">Source :</span> <code>/api/health</code>
        </p>
        <p>
          Les datasets sont automatiquement rafraîchis chaque lundi à 06:15 UTC via le workflow GitHub Actions{' '}
          <code className="bg-gray-200 px-1 rounded">lyra-plus-ops</code>.
        </p>
      </div>
    </div>
  );
}
