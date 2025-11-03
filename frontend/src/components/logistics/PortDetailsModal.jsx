import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PortDetailsModal({ isOpen, onClose, port }) {
  if (!port) return null;

  const agents = port.agents || [];
  const services = port.services || [];
  const historicalStats = port.historical_stats || [];
  const lsci = port.lsci || null;
  const latestStats = port.latest_stats || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <span>🚢</span>
            <span>{port.port_name}</span>
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline">{port.country_name}</Badge>
              <Badge variant="secondary">{port.port_type}</Badge>
              {port.un_locode && <Badge>{port.un_locode}</Badge>}
              {latestStats.performance_grade && (
                <Badge className={`
                  ${latestStats.performance_grade.startsWith('A') ? 'bg-green-600' : ''}
                  ${latestStats.performance_grade.startsWith('B') ? 'bg-yellow-600' : ''}
                  ${latestStats.performance_grade.startsWith('C') ? 'bg-orange-600' : ''}
                  ${latestStats.performance_grade.startsWith('D') ? 'bg-red-600' : ''}
                  text-white
                `}>
                  Performance: {latestStats.performance_grade}
                </Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* KPIs Principaux */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <p className="text-xs text-blue-700 font-semibold">📦 TEU/an</p>
            <p className="text-lg font-bold text-blue-600">
              {latestStats.container_throughput_teu?.toLocaleString('fr-FR') || 'N/A'}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <p className="text-xs text-green-700 font-semibold">⚖️ Tonnes/an</p>
            <p className="text-lg font-bold text-green-600">
              {latestStats.cargo_throughput_tons?.toLocaleString('fr-FR') || 'N/A'}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <p className="text-xs text-purple-700 font-semibold">⚓ Escales</p>
            <p className="text-lg font-bold text-purple-600">
              {latestStats.vessel_calls?.toLocaleString('fr-FR') || 'N/A'}
            </p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-center">
            <p className="text-xs text-orange-700 font-semibold">⏱️ Temps Port</p>
            <p className="text-lg font-bold text-orange-600">
              {latestStats.median_time_in_port_hours ? `${latestStats.median_time_in_port_hours}h` : 'N/A'}
            </p>
          </div>
          <div className="bg-pink-50 p-3 rounded-lg text-center">
            <p className="text-xs text-pink-700 font-semibold">⏳ Attente</p>
            <p className="text-lg font-bold text-pink-600">
              {latestStats.average_waiting_time_hours ? `${latestStats.average_waiting_time_hours}h` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Indicateurs Avancés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {latestStats.berth_productivity_moves_per_hour && (
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-3 rounded-lg border-l-4 border-cyan-500">
              <p className="text-xs font-semibold text-cyan-700">🏗️ Productivité Quai</p>
              <p className="text-lg font-bold text-cyan-900">
                {latestStats.berth_productivity_moves_per_hour} mouvements/heure
              </p>
            </div>
          )}
          
          {lsci && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border-l-4 border-indigo-500">
              <p className="text-xs font-semibold text-indigo-700">🌍 LSCI (Connectivité)</p>
              <p className="text-lg font-bold text-indigo-900">
                {lsci.value} / 100
                <span className="text-sm text-gray-600 ml-2">(#{lsci.world_rank} mondial)</span>
              </p>
            </div>
          )}
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border-l-4 border-green-500">
            <p className="text-xs font-semibold text-green-700">📊 Année Données</p>
            <p className="text-lg font-bold text-green-900">
              {latestStats.year || 2024}
            </p>
          </div>
        </div>

        {/* Tabs pour les différentes sections */}
        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agents">
              👥 Agents ({agents.length})
            </TabsTrigger>
            <TabsTrigger value="services">
              🚢 Lignes ({services.length})
            </TabsTrigger>
            <TabsTrigger value="stats">
              📈 Évolution
            </TabsTrigger>
            <TabsTrigger value="info">
              ℹ️ Infos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="mt-4">
            {agents.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {agents.map((agent, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <div>
                          <p className="font-bold text-gray-900">{agent.agent_name}</p>
                          {agent.group && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {agent.group}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                <p>Aucun agent maritime répertorié.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="mt-4">
            {services.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-blue-900 flex items-center gap-2">
                          <span>🚢</span>
                          <span>{service.carrier}</span>
                        </p>
                        <p className="text-sm text-gray-800 font-semibold mt-1">
                          {service.service_name}
                        </p>
                        {service.frequency && (
                          <p className="text-sm text-gray-700 mt-1">
                            <span className="font-semibold">Fréquence:</span> {service.frequency}
                          </p>
                        )}
                        {service.rotation && (
                          <p className="text-xs text-gray-600 mt-1">
                            <span className="font-semibold">Rotation:</span> {service.rotation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                <p>Aucune ligne régulière répertoriée.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            {historicalStats.length > 0 ? (
              <div className="space-y-4">
                {/* Graphique TEU */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Évolution Trafic Conteneurs (TEU)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={historicalStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => value.toLocaleString('fr-FR')} />
                      <Line type="monotone" dataKey="container_throughput_teu" stroke="#3b82f6" strokeWidth={2} name="TEU" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Graphique Temps au Port */}
                {historicalStats[0]?.median_time_in_port_hours && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Évolution Temps au Port (heures)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={historicalStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="median_time_in_port_hours" stroke="#f59e0b" strokeWidth={2} name="Heures" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Tableau comparatif */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Tableau Comparatif Annuel</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Année</th>
                          <th className="text-right p-2">TEU</th>
                          <th className="text-right p-2">Tonnes</th>
                          <th className="text-right p-2">Escales</th>
                          <th className="text-right p-2">Temps Port</th>
                          <th className="text-center p-2">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historicalStats.map((stat, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-bold">{stat.year}</td>
                            <td className="text-right p-2">{stat.container_throughput_teu?.toLocaleString('fr-FR')}</td>
                            <td className="text-right p-2">{stat.cargo_throughput_tons?.toLocaleString('fr-FR')}</td>
                            <td className="text-right p-2">{stat.vessel_calls?.toLocaleString('fr-FR')}</td>
                            <td className="text-right p-2">{stat.median_time_in_port_hours}h</td>
                            <td className="text-center p-2">
                              <Badge className={`text-xs ${
                                stat.performance_grade?.startsWith('A') ? 'bg-green-600' :
                                stat.performance_grade?.startsWith('B') ? 'bg-yellow-600' :
                                stat.performance_grade?.startsWith('C') ? 'bg-orange-600' : 'bg-red-600'
                              }`}>
                                {stat.performance_grade}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                <p>Aucune donnée historique disponible.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="info" className="mt-4 space-y-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-xs font-semibold text-gray-700">📍 Coordonnées GPS</p>
              <p className="text-sm text-gray-900 mt-1">
                Latitude: {port.geo_lat}° • Longitude: {port.geo_lon}°
              </p>
            </div>
            
            {port.un_locode && (
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-xs font-semibold text-gray-700">🏷️ UN/LOCODE</p>
                <p className="text-sm text-gray-900 mt-1">{port.un_locode}</p>
              </div>
            )}

            {port.port_id && (
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-xs font-semibold text-gray-700">🆔 Port ID</p>
                <p className="text-sm text-gray-900 mt-1">{port.port_id}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
