import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const StatisticsZaubaStyle = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/statistics`);
      setStatistics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Chargement des statistiques...</div>;
  }

  if (!statistics) {
    return <div className="text-center py-10">Aucune donnée disponible</div>;
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  return (
    <div className="space-y-6">
      {/* Section Résumé - Style Zauba */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          📊 Analyse du Commerce Africain - ZLECAf 2024
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Valeur Totale */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Valeur Totale Commerce</p>
            <p className="text-3xl font-extrabold text-blue-700">
              ${statistics.overview?.estimated_combined_gdp ? 
                (statistics.overview.estimated_combined_gdp / 1000000000).toFixed(0) : '2706'}B
            </p>
            <p className="text-xs text-gray-500 mt-1">PIB Combiné</p>
          </div>

          {/* Volume Total */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Exportations Totales</p>
            <p className="text-3xl font-extrabold text-green-700">$1,434B</p>
            <p className="text-xs text-gray-500 mt-1">2024 Estimé</p>
          </div>

          {/* Prix Moyen */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Importations Totales</p>
            <p className="text-3xl font-extrabold text-orange-700">$1,272B</p>
            <p className="text-xs text-gray-500 mt-1">2024 Estimé</p>
          </div>

          {/* Nombre de pays */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Pays Membres</p>
            <p className="text-3xl font-extrabold text-purple-700">
              {statistics.overview?.african_countries_members || 54}
            </p>
            <p className="text-xs text-gray-500 mt-1">ZLECAf</p>
          </div>
        </div>

        {/* Top Exportateurs et Importateurs côte à côte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Exportateurs */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-green-700 flex items-center gap-2">
              <span>📤</span>
              <span>Top 10 Exportateurs</span>
            </h3>
            <div className="space-y-2">
              {statistics.top_exporters_2024?.slice(0, 10).map((exporter, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded hover:bg-green-100 transition-colors border-l-4 border-green-500">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 text-white text-xs">{index + 1}</Badge>
                    <span className="text-sm font-semibold text-gray-800">{exporter.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-700">${exporter.exports}B</p>
                    <p className="text-xs text-gray-500">{exporter.share}% du total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Importateurs */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
              <span>📥</span>
              <span>Top 10 Importateurs</span>
            </h3>
            <div className="space-y-2">
              {statistics.top_importers_2024?.slice(0, 10).map((importer, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors border-l-4 border-blue-500">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white text-xs">{index + 1}</Badge>
                    <span className="text-sm font-semibold text-gray-800">{importer.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-700">${importer.imports}B</p>
                    <p className="text-xs text-gray-500">{importer.share}% du total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Graphique Évolution Commerce */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-xl font-bold">📈 Évolution du Commerce Intra-Africain</CardTitle>
          <CardDescription className="text-sm">Tendance 2023-2024 avec projections 2025-2030</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {statistics.trade_evolution && (
            <div style={{ minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={[
                  { année: '2023', valeur: parseFloat(statistics.trade_evolution.intra_african_trade_2023) },
                  { année: '2024', valeur: parseFloat(statistics.trade_evolution.intra_african_trade_2024) },
                  { année: '2025', valeur: parseFloat(statistics.trade_evolution.intra_african_trade_2024) * 1.12 },
                  { année: '2030', valeur: parseFloat(statistics.trade_evolution.intra_african_trade_2024) * 1.52 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="année" tick={{ fontSize: 12, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'Milliards USD', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
                  <Tooltip formatter={(value) => [`$${value.toFixed(1)}B`, 'Commerce']} />
                  <Legend />
                  <Line type="monotone" dataKey="valeur" stroke="#10b981" strokeWidth={3} name="Commerce Intra-Africain" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Répartition par Secteur - Pie Chart */}
      {statistics.sector_performance && Object.keys(statistics.sector_performance).length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <CardTitle className="text-xl font-bold">🏭 Performance par Secteur</CardTitle>
            <CardDescription className="text-sm">Distribution des exportations par secteur économique</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div style={{ minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={Object.entries(statistics.sector_performance).slice(0, 8).map(([key, value]) => {
                        const shareValue = typeof value === 'object' && value.share ? value.share : 
                                          typeof value === 'object' && value.value_2024 ? value.value_2024 : 
                                          parseFloat(value) || 10;
                        return {
                          name: key.replace(/_/g, ' '),
                          value: parseFloat(shareValue)
                        };
                      })}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(statistics.sector_performance).slice(0, 8).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold mb-3 text-gray-700">Détail des Secteurs</h4>
                {Object.entries(statistics.sector_performance).slice(0, 8).map(([key, value], index) => {
                  const shareValue = typeof value === 'object' && value.share ? value.share : 
                                    typeof value === 'object' && value.value_2024 ? value.value_2024 : 
                                    parseFloat(value) || 10;
                  const displayName = key.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                  
                  return (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-xs font-semibold">{displayName}</span>
                      </div>
                      <Badge className="text-xs">{parseFloat(shareValue).toFixed(1)}%</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatisticsZaubaStyle;
