import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';

const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return new Intl.NumberFormat('fr-FR').format(num);
};

export default function AirportCard({ airport, onOpenDetails }) {
  const stats = airport?.historical_stats?.[0] || {};

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 border-b">
        <CardTitle className="text-xl font-bold text-sky-900 flex items-center gap-2">
          <span>✈️</span>
          <span>{airport.airport_name}</span>
          {airport.iata_code && (
            <span className="text-sm font-normal text-gray-600">({airport.iata_code})</span>
          )}
        </CardTitle>
        <CardDescription className="text-sm">
          <span className="font-semibold">{airport.country_name}</span> • 
          <span className="ml-2 text-sky-600">{airport.icao_code}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Cargo Fret */}
          <div className="bg-sky-50 p-3 rounded-lg border-l-4 border-sky-500">
            <p className="text-xs font-semibold text-sky-700 mb-1">📦 Fret (Cargo)</p>
            <p className="text-xl font-bold text-sky-600">
              {formatNumber(stats?.cargo_throughput_tons)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {stats?.year || 2024} • tonnes/an
            </p>
          </div>

          {/* Courrier */}
          <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500">
            <p className="text-xs font-semibold text-amber-700 mb-1">📬 Courrier</p>
            <p className="text-xl font-bold text-amber-600">
              {formatNumber(stats?.mail_throughput_tons)}
            </p>
            <p className="text-xs text-gray-600 mt-1">tonnes/an</p>
          </div>

          {/* Mouvements Cargo */}
          <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
            <p className="text-xs font-semibold text-green-700 mb-1">🛩️ Mouvements</p>
            <p className="text-xl font-bold text-green-600">
              {formatNumber(stats?.cargo_aircraft_movements)}
            </p>
            <p className="text-xs text-gray-600 mt-1">avions/an</p>
          </div>
        </div>

        {/* Capacité et Infrastructure */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs font-semibold text-gray-700">📊 Capacité Annuelle</p>
            <p className="text-sm font-bold text-gray-900">
              {formatNumber(airport.annual_capacity_tons)} t/an
            </p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs font-semibold text-gray-700">🏢 Terminal Cargo</p>
            <p className="text-sm font-bold text-gray-900">
              {formatNumber(airport.cargo_terminal_area_sqm)} m²
            </p>
          </div>
        </div>

        {/* Acteurs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs font-semibold text-gray-700">✈️ Compagnies Cargo</p>
            <p className="text-sm font-bold text-gray-900">
              {airport.actors?.filter(a => a.actor_type === 'airline').length || 0}
            </p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs font-semibold text-gray-700">🌐 Routes Régulières</p>
            <p className="text-sm font-bold text-gray-900">
              {airport.routes?.length || 0}
            </p>
          </div>
        </div>

        <Button 
          onClick={() => onOpenDetails(airport)} 
          className="w-full bg-sky-600 hover:bg-sky-700 text-white"
        >
          🔍 Voir les détails complets
        </Button>
      </CardContent>
    </Card>
  );
}
