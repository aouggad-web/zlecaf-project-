import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const TradeComparison = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMetric, setSelectedMetric] = useState('exports');
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [calculations, setCalculations] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'savings', direction: 'desc' });

  // Fetch des statistiques réelles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsResponse = await axios.get(`${API_URL}/api/statistics`);
        setStatistics(statsResponse.data);
        
        // Simuler quelques calculs pour avoir des données de comparaison
        // En production, ces données viendraient de la base MongoDB
        const mockCalculations = [
          { country: 'ZA', name: 'Afrique du Sud', exports: 89.5, imports: 64.7, balance: 24.8, savings: 15.2 },
          { country: 'NG', name: 'Nigéria', exports: 64.7, imports: 54.2, balance: 10.5, savings: 12.8 },
          { country: 'EG', name: 'Égypte', exports: 42.1, imports: 48.3, balance: -6.2, savings: 10.5 },
          { country: 'MA', name: 'Maroc', exports: 38.9, imports: 42.1, balance: -3.2, savings: 9.2 },
          { country: 'KE', name: 'Kenya', exports: 28.4, imports: 32.7, balance: -4.3, savings: 7.8 },
          { country: 'GH', name: 'Ghana', exports: 24.2, imports: 28.9, balance: -4.7, savings: 6.5 },
          { country: 'CI', name: 'Côte d\'Ivoire', exports: 18.7, imports: 22.4, balance: -3.7, savings: 5.9 },
          { country: 'SN', name: 'Sénégal', exports: 16.3, imports: 19.8, balance: -3.5, savings: 4.8 },
          { country: 'TZ', name: 'Tanzanie', exports: 14.8, imports: 18.2, balance: -3.4, savings: 4.2 },
          { country: 'ET', name: 'Éthiopie', exports: 12.9, imports: 16.5, balance: -3.6, savings: 3.9 }
        ];
        setCalculations(mockCalculations);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculer la vue d'ensemble à partir des statistiques réelles
  const tradeOverview = statistics ? {
    totalTrade: { 
      value: (statistics.overview?.estimated_combined_gdp / 1000000000).toFixed(1) || 3400, 
      change: 12.5, 
      unit: 'Milliards USD' 
    },
    exports: { 
      value: ((statistics.overview?.estimated_combined_gdp / 1000000000) * 0.53).toFixed(0) || 1800, 
      change: 8.3, 
      unit: 'Milliards USD' 
    },
    imports: { 
      value: ((statistics.overview?.estimated_combined_gdp / 1000000000) * 0.47).toFixed(0) || 1600, 
      change: 15.2, 
      unit: 'Milliards USD' 
    },
    balance: { 
      value: ((statistics.overview?.estimated_combined_gdp / 1000000000) * 0.06).toFixed(0) || 200, 
      change: 0, 
      unit: 'Milliards USD', 
      status: 'Excédent' 
    }
  } : {
    totalTrade: { value: 3400, change: 12.5, unit: 'Milliards USD' },
    exports: { value: 1800, change: 8.3, unit: 'Milliards USD' },
    imports: { value: 1600, change: 15.2, unit: 'Milliards USD' },
    balance: { value: 200, change: 0, unit: 'Milliards USD', status: 'Excédent' }
  };

  // Comparaison tarifs par année (NPF vs ZLECAf)
  const tariffComparison = [
    { annee: '2025', NPF: 15.5, ZLECAf: 7.8, economie: 7.7 },
    { annee: '2027', NPF: 15.5, ZLECAf: 4.7, economie: 10.8 },
    { annee: '2030', NPF: 15.5, ZLECAf: 1.6, economie: 13.9 },
    { annee: '2033', NPF: 15.5, ZLECAf: 0.3, economie: 15.2 },
    { annee: '2035', NPF: 15.5, ZLECAf: 0, economie: 15.5 }
  ];

  // Top pays par économies tarifaires
  const topCountriesSavings = [
    { rank: 1, country: '🇿🇦 Afrique du Sud', savings: 89.5, flag: 'ZA' },
    { rank: 2, country: '🇳🇬 Nigéria', savings: 64.7, flag: 'NG' },
    { rank: 3, country: '🇪🇬 Égypte', savings: 42.1, flag: 'EG' },
    { rank: 4, country: '🇲🇦 Maroc', savings: 38.9, flag: 'MA' },
    { rank: 5, country: '🇰🇪 Kenya', savings: 28.4, flag: 'KE' },
    { rank: 6, country: '🇬🇭 Ghana', savings: 24.2, flag: 'GH' },
    { rank: 7, country: '🇨🇮 Côte d\'Ivoire', savings: 18.7, flag: 'CI' },
    { rank: 8, country: '🇸🇳 Sénégal', savings: 16.3, flag: 'SN' }
  ];

  // Performance commerciale par pays avec données de calculs
  const countryPerformance = [
    { country: '🇿🇦 Afrique du Sud', exports: 89.5, imports: 64.7, balance: 24.8, savings: 12.5 },
    { country: '🇳🇬 Nigéria', exports: 64.7, imports: 54.2, balance: 10.5, savings: 10.8 },
    { country: '🇪🇬 Égypte', exports: 42.1, imports: 48.3, balance: -6.2, savings: 8.2 },
    { country: '🇲🇦 Maroc', exports: 38.9, imports: 42.1, balance: -3.2, savings: 7.5 },
    { country: '🇰🇪 Kenya', exports: 28.4, imports: 32.7, balance: -4.3, savings: 6.1 }
  ];

  return (
    <div className="space-y-8">
      {/* Vue d'ensemble Commerce - 4 Cartes Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-l-blue-600 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Commerce Total ZLECAf</span>
              <i className="fas fa-chart-line text-blue-600 text-xl"></i>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-700">${tradeOverview.totalTrade.value}B</span>
              <Badge className="bg-green-600 text-white">+{tradeOverview.totalTrade.change}%</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">YoY</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-600 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Exportations</span>
              <i className="fas fa-arrow-up text-green-600 text-xl"></i>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-700">${tradeOverview.exports.value}B</span>
              <Badge className="bg-green-600 text-white">+{tradeOverview.exports.change}%</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">YoY</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-l-4 border-l-orange-600 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Importations</span>
              <i className="fas fa-arrow-down text-orange-600 text-xl"></i>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-orange-700">${tradeOverview.imports.value}B</span>
              <Badge className="bg-orange-600 text-white">+{tradeOverview.imports.change}%</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">YoY</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-l-purple-600 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Solde Commercial</span>
              <i className="fas fa-balance-scale text-purple-600 text-xl"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-purple-700">+${tradeOverview.balance.value}B</span>
              <Badge className="bg-purple-600 text-white w-fit mt-2">{tradeOverview.balance.status}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique Comparaison Tarifs NPF vs ZLECAf */}
      <Card className="shadow-2xl border-t-4 border-t-indigo-600">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
            <i className="fas fa-chart-bar"></i>
            <span>Évolution Tarifaire: NPF vs ZLECAf (2025-2035)</span>
          </CardTitle>
          <CardDescription className="text-lg font-semibold">
            Démantèlement progressif des droits de douane
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div style={{ minHeight: '380px' }}>
            <ResponsiveContainer width="100%" height={350} debounce={300}>
              <LineChart data={tariffComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" label={{ value: 'Année', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Taux Tarifaire (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="NPF" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  name="Tarif NPF" 
                  dot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="ZLECAf" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  name="Tarif ZLECAf" 
                  dot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="economie" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  name="Économie %" 
                  dot={{ r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700 font-semibold">
              ✅ En 2035, les tarifs ZLECAf atteignent 0% pour les produits non-sensibles, permettant des économies maximales de 15.5% par rapport aux tarifs NPF.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance par Pays avec Graphique */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-xl border-t-4 border-t-blue-600">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="text-xl font-bold text-blue-700 flex items-center gap-2">
                <i className="fas fa-globe-africa"></i>
                <span>Performance Commerciale par Pays</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex gap-4 mb-4">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exports">Exportations</SelectItem>
                    <SelectItem value="imports">Importations</SelectItem>
                    <SelectItem value="balance">Solde Commercial</SelectItem>
                    <SelectItem value="savings">Économies ZLECAf</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2030">2030</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div style={{ minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height={280} debounce={300}>
                  <BarChart 
                    data={countryPerformance}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="country" type="category" width={150} />
                    <Tooltip formatter={(value) => `$${value.toFixed(1)}B`} />
                    <Bar dataKey={selectedMetric} fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar avec Top Pays et Indicateurs */}
        <div className="space-y-6">
          {/* Top Pays - Économies Tarifaires */}
          <Card className="shadow-lg border-l-4 border-l-yellow-500">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 pb-3">
              <CardTitle className="text-lg font-bold text-yellow-700 flex items-center gap-2">
                <i className="fas fa-trophy"></i>
                <span>Top Économies Tarifaires</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {topCountriesSavings.map((item) => (
                  <div 
                    key={item.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      item.rank === 1 ? 'bg-yellow-100 border-2 border-yellow-400' :
                      item.rank === 2 ? 'bg-gray-100 border-2 border-gray-400' :
                      item.rank === 3 ? 'bg-orange-100 border-2 border-orange-400' :
                      'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xl font-bold ${
                        item.rank === 1 ? 'text-yellow-600' :
                        item.rank === 2 ? 'text-gray-600' :
                        item.rank === 3 ? 'text-orange-600' :
                        'text-blue-600'
                      }`}>
                        {item.rank}
                      </span>
                      <span className="font-semibold text-gray-800">{item.country}</span>
                    </div>
                    <Badge className="bg-green-600 text-white font-bold">
                      ${item.savings.toFixed(1)}B
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Indicateurs Clés */}
          <Card className="shadow-lg border-l-4 border-l-green-500">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-3">
              <CardTitle className="text-lg font-bold text-green-700 flex items-center gap-2">
                <i className="fas fa-chart-pie"></i>
                <span>Indicateurs Clés</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Commerce intra-africain</span>
                <Badge className="bg-blue-600 text-white text-base">16.3%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Diversification exports</span>
                <Badge className="bg-purple-600 text-white text-base">7.2/10</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Facilitation commerce</span>
                <Badge className="bg-orange-600 text-white text-base">58.3/100</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Impact ZLECAf */}
          <Card className="shadow-lg border-l-4 border-l-red-500">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 pb-3">
              <CardTitle className="text-lg font-bold text-red-700 flex items-center gap-2">
                <i className="fas fa-fire"></i>
                <span>Impact ZLECAf</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Réduction tarifaire moyenne</p>
                <p className="text-3xl font-bold text-red-600">90%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Augmentation commerce</p>
                <p className="text-3xl font-bold text-green-600">+52%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Gain de revenu (2035)</p>
                <p className="text-3xl font-bold text-blue-600">$450B</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradeComparison;
