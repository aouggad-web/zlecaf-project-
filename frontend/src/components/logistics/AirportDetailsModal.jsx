import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return new Intl.NumberFormat('fr-FR').format(num);
};

export default function AirportDetailsModal({ airport, open, onClose }) {
  if (!airport) return null;

  const latestStats = airport.historical_stats?.[0] || {};

  // Préparer les données historiques pour les graphiques
  const historicalData = airport.historical_stats ? [...airport.historical_stats].reverse() : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-sky-900 flex items-center gap-2">
            <span>✈️</span>
            {airport.airport_name}
            {airport.iata_code && (
              <Badge variant="outline" className="ml-2 text-sm">{airport.iata_code}</Badge>
            )}
          </DialogTitle>
          <DialogDescription className="flex gap-2 mt-2">
            <Badge className="bg-sky-600">{airport.country_name}</Badge>
            <Badge variant="outline">{airport.icao_code}</Badge>
          </DialogDescription>
        </DialogHeader>

        {/* KPI Cards Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
          <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
            <CardContent className="pt-4">
              <p className="text-xs font-semibold text-sky-700 mb-1">📦 Fret Cargo {latestStats.year}</p>
              <p className="text-2xl font-bold text-sky-900">{formatNumber(latestStats.cargo_throughput_tons)}</p>
              <p className="text-xs text-gray-600">tonnes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="pt-4">
              <p className="text-xs font-semibold text-amber-700 mb-1">📬 Courrier {latestStats.year}</p>
              <p className="text-2xl font-bold text-amber-900">{formatNumber(latestStats.mail_throughput_tons)}</p>
              <p className="text-xs text-gray-600">tonnes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-4">
              <p className="text-xs font-semibold text-green-700 mb-1">🛩️ Mouvements {latestStats.year}</p>
              <p className="text-2xl font-bold text-green-900">{formatNumber(latestStats.cargo_aircraft_movements)}</p>
              <p className="text-xs text-gray-600">avions cargo</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-4">
              <p className="text-xs font-semibold text-purple-700 mb-1">📊 Capacité Annuelle</p>
              <p className="text-2xl font-bold text-purple-900">{formatNumber(airport.annual_capacity_tons)}</p>
              <p className="text-xs text-gray-600">tonnes/an</p>
            </CardContent>
          </Card>
        </div>

        {/* Infrastructure Section */}
        <Card className="mb-4">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>🏗️</span>
              Infrastructure Cargo
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏢</span>
                <div>
                  <p className="text-xs text-gray-600">Surface Terminal Cargo</p>
                  <p className="font-bold text-gray-900">{formatNumber(airport.cargo_terminal_area_sqm)} m²</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-xs text-gray-600">Coordonnées GPS</p>
                  <p className="font-bold text-gray-900">{airport.geo_lat?.toFixed(4)}, {airport.geo_lon?.toFixed(4)}</p>
                </div>
              </div>
            </div>
            {airport.cargo_infra_notes && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">💡 Notes: </span>
                  {airport.cargo_infra_notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs for Actors, Routes, Statistics */}
        <Tabs defaultValue="actors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="actors">✈️ Acteurs Cargo ({airport.actors?.length || 0})</TabsTrigger>
            <TabsTrigger value="routes">🌐 Routes ({airport.routes?.length || 0})</TabsTrigger>
            <TabsTrigger value="stats">📈 Statistiques Historiques</TabsTrigger>
          </TabsList>

          {/* Actors Tab */}
          <TabsContent value="actors" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acteurs du Cargo Aérien</CardTitle>
              </CardHeader>
              <CardContent>
                {airport.actors && airport.actors.length > 0 ? (
                  <div className="space-y-3">
                    {/* Compagnies Aériennes */}
                    <div>
                      <h4 className="font-semibold text-sky-900 mb-2 flex items-center gap-2">
                        <span>✈️</span>
                        Compagnies Aériennes Cargo
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {airport.actors.filter(a => a.actor_type === 'airline').map((actor, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-sky-50 rounded">
                            <span className="text-lg">✈️</span>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{actor.actor_name}</p>
                              <p className="text-xs text-gray-600">{actor.group}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Handlers */}
                    {airport.actors.filter(a => a.actor_type === 'handler').length > 0 && (
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <span>🔧</span>
                          Handlers & Services au Sol
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {airport.actors.filter(a => a.actor_type === 'handler').map((actor, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                              <span className="text-lg">🔧</span>
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{actor.actor_name}</p>
                                <p className="text-xs text-gray-600">{actor.group}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Freight Forwarders */}
                    {airport.actors.filter(a => a.actor_type === 'forwarder').length > 0 && (
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                          <span>📦</span>
                          Transitaires & Freight Forwarders
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {airport.actors.filter(a => a.actor_type === 'forwarder').map((actor, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                              <span className="text-lg">📦</span>
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{actor.actor_name}</p>
                                <p className="text-xs text-gray-600">{actor.group}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucun acteur enregistré</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Routes Tab */}
          <TabsContent value="routes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Routes Cargo Régulières</CardTitle>
              </CardHeader>
              <CardContent>
                {airport.routes && airport.routes.length > 0 ? (
                  <div className="space-y-3">
                    {airport.routes.map((route, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-bold text-sky-900 flex items-center gap-2">
                              <span>✈️</span>
                              {route.carrier}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                              {route.route_description}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-white">
                            {route.frequency}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">🛩️ Appareils:</span>
                            <span className="text-sm font-semibold">{route.aircraft_types}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">🔄 Rotation:</span>
                            <span className="text-sm font-semibold">{route.rotation}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucune route enregistrée</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="mt-4">
            <div className="space-y-4">
              {historicalData.length > 0 ? (
                <>
                  {/* Cargo Throughput Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">📦 Évolution du Fret Cargo (tonnes)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={historicalData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatNumber(value)} />
                          <Legend />
                          <Line type="monotone" dataKey="cargo_throughput_tons" stroke="#0284c7" strokeWidth={2} name="Fret (tonnes)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Aircraft Movements Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">🛩️ Mouvements d'Avions Cargo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={historicalData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatNumber(value)} />
                          <Legend />
                          <Bar dataKey="cargo_aircraft_movements" fill="#10b981" name="Mouvements Cargo" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Historical Data Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">📊 Tableau Comparatif Annuel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="p-2 text-left">Année</th>
                              <th className="p-2 text-right">Fret (tonnes)</th>
                              <th className="p-2 text-right">Courrier (tonnes)</th>
                              <th className="p-2 text-right">Mouvements</th>
                              <th className="p-2 text-left">Source</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...historicalData].reverse().map((stat, idx) => (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="p-2 font-semibold">{stat.year}</td>
                                <td className="p-2 text-right">{formatNumber(stat.cargo_throughput_tons)}</td>
                                <td className="p-2 text-right">{formatNumber(stat.mail_throughput_tons)}</td>
                                <td className="p-2 text-right">{formatNumber(stat.cargo_aircraft_movements)}</td>
                                <td className="p-2">
                                  <a 
                                    href={stat.source_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sky-600 hover:underline text-xs"
                                  >
                                    {stat.source_org}
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-gray-500 text-center">Aucune donnée historique disponible</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
