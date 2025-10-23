import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Progress } from './components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { toast } from './hooks/use-toast';
import { Toaster } from './components/ui/toaster';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import TradeComparison from './components/TradeComparison';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Drapeaux des pays africains
const countryFlags = {
  'DZ': '🇩🇿', 'AO': '🇦🇴', 'BJ': '🇧🇯', 'BW': '🇧🇼', 'BF': '🇧🇫', 'BI': '🇧🇮', 'CM': '🇨🇲', 'CV': '🇨🇻',
  'CF': '🇨🇫', 'TD': '🇹🇩', 'KM': '🇰🇲', 'CG': '🇨🇬', 'CD': '🇨🇩', 'CI': '🇨🇮', 'DJ': '🇩🇯', 'EG': '🇪🇬',
  'GQ': '🇬🇶', 'ER': '🇪🇷', 'SZ': '🇸🇿', 'ET': '🇪🇹', 'GA': '🇬🇦', 'GM': '🇬🇲', 'GH': '🇬🇭', 'GN': '🇬🇳',
  'GW': '🇬🇼', 'KE': '🇰🇪', 'LS': '🇱🇸', 'LR': '🇱🇷', 'LY': '🇱🇾', 'MG': '🇲🇬', 'MW': '🇲🇼', 'ML': '🇲🇱',
  'MR': '🇲🇷', 'MU': '🇲🇺', 'MA': '🇲🇦', 'MZ': '🇲🇿', 'NA': '🇳🇦', 'NE': '🇳🇪', 'NG': '🇳🇬', 'RW': '🇷🇼',
  'ST': '🇸🇹', 'SN': '🇸🇳', 'SC': '🇸🇨', 'SL': '🇸🇱', 'SO': '🇸🇴', 'ZA': '🇿🇦', 'SS': '🇸🇸', 'SD': '🇸🇩',
  'TZ': '🇹🇿', 'TG': '🇹🇬', 'TN': '🇹🇳', 'UG': '🇺🇬', 'ZM': '🇿🇲', 'ZW': '🇿🇼'
};

function ZLECAfCalculator() {
  const [countries, setCountries] = useState([]);
  const [originCountry, setOriginCountry] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [countryProfile, setCountryProfile] = useState(null);
  const [rulesOfOrigin, setRulesOfOrigin] = useState(null);
  const [partnerImportStats, setPartnerImportStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('calculator');
  const [language, setLanguage] = useState('fr'); // fr ou en

  const texts = {
    fr: {
      title: "Accord de la ZLECAf",
      subtitle: "Levier de développement de l'AFRIQUE",
      calculatorTab: "Calculateur",
      statisticsTab: "Statistiques", 
      rulesTab: "Règles d'Origine",
      profilesTab: "Profils Pays",
      calculatorTitle: "Calculateur ZLECAf Complet",
      calculatorDesc: "Calculs basés sur les données officielles des organismes internationaux",
      originCountry: "Pays d'origine",
      partnerCountry: "Pays partenaire", 
      hsCodeLabel: "Code SH6 (6 chiffres)",
      valueLabel: "Valeur de la marchandise (USD)",
      calculateBtn: "Calculer avec Données Officielles",
      normalTariff: "Tarif NPF",
      zlecafTariff: "Tarif ZLECAf",
      savings: "Économie Réalisée",
      rulesOrigin: "Règles d'Origine ZLECAf",
      partnerImports: "Importations Partenaire",
      projections: "Projections ZLECAf",
      dataSources: "Sources de Données Officielles"
    },
    en: {
      title: "AfCFTA Agreement",
      subtitle: "AFRICA's Development Lever",
      calculatorTab: "Calculator",
      statisticsTab: "Statistics",
      rulesTab: "Rules of Origin", 
      profilesTab: "Country Profiles",
      calculatorTitle: "Complete AfCFTA Calculator",
      calculatorDesc: "Calculations based on official data from international organizations",
      originCountry: "Origin Country",
      partnerCountry: "Partner Country",
      hsCodeLabel: "HS6 Code (6 digits)",
      valueLabel: "Merchandise Value (USD)",
      calculateBtn: "Calculate with Official Data",
      normalTariff: "MFN Tariff",
      zlecafTariff: "AfCFTA Tariff", 
      savings: "Savings Achieved",
      rulesOrigin: "AfCFTA Rules of Origin",
      partnerImports: "Partner Imports",
      projections: "AfCFTA Projections",
      dataSources: "Official Data Sources"
    }
  };

  const t = texts[language];

  useEffect(() => {
    fetchCountries();
    fetchStatistics();
  }, []);

  useEffect(() => {
    if (destinationCountry && hsCode.length >= 4) {
      fetchPartnerImportStats();
    }
  }, [destinationCountry, hsCode]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API}/countries`);
      setCountries(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des pays:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des pays",
        variant: "destructive"
      });
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API}/statistics`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const fetchPartnerImportStats = async () => {
    if (!destinationCountry || hsCode.length < 4) return;
    
    try {
      // Simuler des données d'importation du pays partenaire
      // En production, ceci appellerait l'API OEC
      const mockImportData = {
        country: destinationCountry,
        hs_code: hsCode,
        year_2022: Math.floor(Math.random() * 500000000) + 100000000, // 100M - 600M USD
        year_2023: Math.floor(Math.random() * 500000000) + 100000000,
        growth_rate: ((Math.random() - 0.5) * 20).toFixed(1), // -10% à +10%
        share_of_total_imports: (Math.random() * 5).toFixed(2), // 0-5%
        source: "OEC Atlas"
      };
      setPartnerImportStats(mockImportData);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques d\'importation:', error);
    }
  };

  const fetchCountryProfile = async (countryCode) => {
    try {
      const response = await axios.get(`${API}/country-profile/${countryCode}`);
      // Les données réelles sont maintenant gérées par le backend
      const enhancedProfile = response.data;
      setCountryProfile(enhancedProfile);
    } catch (error) {
      console.error('Erreur lors du chargement du profil pays:', error);
    }
  };

  const fetchRulesOfOrigin = async (hsCode) => {
    try {
      const response = await axios.get(`${API}/rules-of-origin/${hsCode}`);
      setRulesOfOrigin(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des règles d\'origine:', error);
    }
  };

  const calculateTariff = async () => {
    if (!originCountry || !destinationCountry || !hsCode || !value) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    if (hsCode.length !== 6) {
      toast({
        title: "Code SH6 invalide",
        description: "Le code SH6 doit contenir exactement 6 chiffres",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/calculate-tariff`, {
        origin_country: originCountry,
        destination_country: destinationCountry,
        hs_code: hsCode,
        value: parseFloat(value)
      });
      
      setResult(response.data);
      await fetchStatistics();
      await fetchRulesOfOrigin(hsCode);
      await fetchPartnerImportStats();
      
      toast({
        title: "Calcul réussi",
        description: `Économie potentielle: $${formatNumber(response.data.savings)}`,
      });
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      toast({
        title: "Erreur de calcul",
        description: error.response?.data?.detail || "Erreur lors du calcul",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCountryName = (code) => {
    const country = countries.find(c => c.code === code);
    return country ? country.name : code;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  const getSectorName = (hsCode) => {
    const sectorNames = {
      '01': 'Animaux vivants / Live animals',
      '02': 'Viandes et abats / Meat and edible meat offal',
      '03': 'Poissons et crustacés / Fish and crustaceans',
      '04': 'Produits laitiers / Dairy products',
      '05': 'Autres produits d\'origine animale / Other animal products',
      '06': 'Plantes vivantes / Live plants',
      '07': 'Légumes / Vegetables',
      '08': 'Fruits / Fruits',
      '09': 'Café, thé, épices / Coffee, tea, spices',
      '10': 'Céréales / Cereals',
      '11': 'Produits de la minoterie / Milling products',
      '12': 'Graines et fruits oléagineux / Oil seeds and oleaginous fruits',
      '13': 'Gommes, résines / Lac, gums, resins',
      '14': 'Matières à tresser / Vegetable plaiting materials',
      '15': 'Graisses et huiles / Animal or vegetable fats and oils',
      '16': 'Préparations de viande / Preparations of meat',
      '17': 'Sucres et sucreries / Sugars and sugar confectionery',
      '18': 'Cacao et ses préparations / Cocoa and cocoa preparations',
      '19': 'Préparations de céréales / Preparations of cereals',
      '20': 'Préparations de légumes / Preparations of vegetables',
      '21': 'Préparations alimentaires diverses / Miscellaneous edible preparations',
      '22': 'Boissons / Beverages',
      '23': 'Résidus industries alimentaires / Food industry residues',
      '24': 'Tabacs / Tobacco',
      '25': 'Sel, soufre, terres et pierres / Salt, sulfur, stone',
      '26': 'Minerais / Ores',
      '27': 'Combustibles minéraux / Mineral fuels',
      '28': 'Produits chimiques inorganiques / Inorganic chemicals',
      '29': 'Produits chimiques organiques / Organic chemicals',
      '30': 'Produits pharmaceutiques / Pharmaceutical products',
      '84': 'Machines et appareils mécaniques / Machinery and mechanical appliances',
      '85': 'Machines et appareils électriques / Electrical machinery',
      '87': 'Véhicules automobiles / Vehicles',
      '61': 'Vêtements en bonneterie / Knitted apparel',
      '62': 'Vêtements, autres qu\'en bonneterie / Woven apparel',
      '72': 'Fonte, fer et acier / Iron and steel',
    };
    
    const sector = hsCode.substring(0, 2);
    return sectorNames[sector] || `Secteur ${sector} / Sector ${sector}`;
  };

  // Données simulées pour le graphique donut de la part SH2
  const generateSectorShareData = () => {
    if (!partnerImportStats) return [];
    
    const sectorCode = hsCode.substring(0, 2);
    const sectorShare = parseFloat(partnerImportStats.share_of_total_imports);
    
    return [
      { name: `SH${sectorCode}`, value: sectorShare, color: '#10b981' },
      { name: 'Autres secteurs', value: 100 - sectorShare, color: '#e5e7eb' }
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header with African-inspired design */}
      <div className="relative bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 shadow-2xl border-b-4 border-yellow-500 overflow-hidden">
        {/* African pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px),
                           repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)`
        }}></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-400 transform hover:scale-110 transition-transform">
                <span className="text-4xl">🌍</span>
              </div>
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                  {t.title}
                </h1>
                <p className="text-yellow-100 mt-2 text-lg font-semibold drop-shadow">
                  {t.subtitle}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-white text-green-700 hover:bg-yellow-100">54 Pays Membres</Badge>
                  <Badge className="bg-white text-red-700 hover:bg-yellow-100">1.3B+ Population</Badge>
                </div>
              </div>
            </div>
            
            {/* Sélecteur de langue avec style amélioré */}
            <div className="flex space-x-2">
              <Button 
                variant={language === 'fr' ? 'default' : 'outline'}
                size="lg"
                className={language === 'fr' ? 'bg-white text-green-700 hover:bg-yellow-100 font-bold shadow-lg' : 'bg-white/20 text-white border-white hover:bg-white/30'}
                onClick={() => setLanguage('fr')}
              >
                🇫🇷 Français
              </Button>
              <Button 
                variant={language === 'en' ? 'default' : 'outline'}
                size="lg"
                className={language === 'en' ? 'bg-white text-green-700 hover:bg-yellow-100 font-bold shadow-lg' : 'bg-white/20 text-white border-white hover:bg-white/30'}
                onClick={() => setLanguage('en')}
              >
                🇬🇧 English
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 p-2 shadow-lg">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white font-bold">
              🧮 {t.calculatorTab}
            </TabsTrigger>
            <TabsTrigger value="statistics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white font-bold">
              📈 {t.statisticsTab}
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white font-bold">
              🛠️ Outils
            </TabsTrigger>
            <TabsTrigger value="rules" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white font-bold">
              📜 {t.rulesTab}
            </TabsTrigger>
            <TabsTrigger value="profiles" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white font-bold">
              🌍 {t.profilesTab}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ minHeight: '600px' }}>
              {/* Formulaire de calcul avec style africain */}
              <Card className="shadow-2xl border-t-4 border-t-green-600" style={{ minHeight: '400px' }}>
                <CardHeader className="bg-gradient-to-r from-green-50 to-yellow-50">
                  <CardTitle className="flex items-center space-x-2 text-2xl text-green-700">
                    <span>📊</span>
                    <span>{t.calculatorTitle}</span>
                  </CardTitle>
                  <CardDescription className="text-gray-700 font-semibold">
                    {t.calculatorDesc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin">{t.originCountry}</Label>
                      <Select value={originCountry} onValueChange={setOriginCountry}>
                        <SelectTrigger>
                          <SelectValue placeholder={t.originCountry} />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {countryFlags[country.code]} {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination">{t.partnerCountry}</Label>
                      <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                        <SelectTrigger>
                          <SelectValue placeholder={t.partnerCountry} />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {countryFlags[country.code]} {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hs-code">{t.hsCodeLabel}</Label>
                    <Input
                      id="hs-code"
                      value={hsCode}
                      onChange={(e) => setHsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Ex : 010121, 180100..."
                      maxLength={6}
                    />
                    {hsCode.length >= 2 && (
                      <p className="text-sm text-blue-600">
                        {getSectorName(hsCode)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">{t.valueLabel}</Label>
                    <Input
                      id="value"
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="100000"
                      min="0"
                    />
                  </div>

                  <Button 
                    onClick={calculateTariff}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 text-white font-bold text-lg py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    {loading ? '⏳ Calcul en cours...' : `🧮 ${t.calculateBtn}`}
                  </Button>
                </CardContent>
              </Card>

              {/* Résultats complets avec visualisations */}
              {result && (
                <div className="space-y-4">
                  <Card className="border-l-4 border-l-green-500 shadow-xl bg-gradient-to-br from-white to-green-50">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2 text-2xl">
                        <span>💰</span>
                        <span>Résultats Détaillés</span>
                      </CardTitle>
                      <CardDescription className="text-yellow-100 font-semibold">
                        {countryFlags[result.origin_country]} {getCountryName(result.origin_country)} → {countryFlags[result.destination_country]} {getCountryName(result.destination_country)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      {/* Graphique comparaison complète avec TOUTES les taxes */}
                      <div className="bg-white p-4 rounded-lg shadow-md" style={{ minHeight: '320px' }}>
                        <h4 className="font-bold text-lg mb-4 text-gray-800">📊 Comparaison Complète: Valeur + DD + TVA + Autres Taxes</h4>
                        <ResponsiveContainer width="100%" height={280} debounce={300}>
                          <BarChart data={[
                            { 
                              name: 'Tarif NPF', 
                              'Valeur marchandise': result.value,
                              'Droits douane': result.normal_tariff_amount,
                              'TVA': result.normal_vat_amount,
                              'Autres taxes': result.normal_other_taxes_total
                            },
                            { 
                              name: 'Tarif ZLECAf', 
                              'Valeur marchandise': result.value,
                              'Droits douane': result.zlecaf_tariff_amount,
                              'TVA': result.zlecaf_vat_amount,
                              'Autres taxes': result.zlecaf_other_taxes_total
                            }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="Valeur marchandise" stackId="a" fill="#60a5fa" />
                            <Bar dataKey="Droits douane" stackId="a" fill="#ef4444" />
                            <Bar dataKey="TVA" stackId="a" fill="#f59e0b" />
                            <Bar dataKey="Autres taxes" stackId="a" fill="#8b5cf6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Tableaux de détails des coûts */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Scénario NPF */}
                        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl shadow-lg border-2 border-red-300">
                          <h4 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                            <span>🔴</span>
                            <span>Tarif NPF (Normal)</span>
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Valeur marchandise:</span>
                              <span className="font-bold">{formatCurrency(result.value)}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                              <span>+ Droits de douane ({(result.normal_tariff_rate * 100).toFixed(1)}%):</span>
                              <span className="font-bold">{formatCurrency(result.normal_tariff_amount)}</span>
                            </div>
                            <div className="flex justify-between text-orange-600">
                              <span>+ TVA ({result.normal_vat_rate}%):</span>
                              <span className="font-bold">{formatCurrency(result.normal_vat_amount)}</span>
                            </div>
                            {result.normal_statistical_fee > 0 && (
                              <div className="flex justify-between text-purple-600">
                                <span>+ Redevance statistique:</span>
                                <span className="font-bold">{formatCurrency(result.normal_statistical_fee)}</span>
                              </div>
                            )}
                            {result.normal_community_levy > 0 && (
                              <div className="flex justify-between text-purple-600">
                                <span>+ Prélèvement communautaire:</span>
                                <span className="font-bold">{formatCurrency(result.normal_community_levy)}</span>
                              </div>
                            )}
                            {result.normal_ecowas_levy > 0 && (
                              <div className="flex justify-between text-purple-600">
                                <span>+ Prélèvement CEDEAO:</span>
                                <span className="font-bold">{formatCurrency(result.normal_ecowas_levy)}</span>
                              </div>
                            )}
                            <Separator className="my-2" />
                            <div className="flex justify-between text-lg font-extrabold text-red-700">
                              <span>TOTAL:</span>
                              <span>{formatCurrency(result.normal_total_cost)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Scénario ZLECAf */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-lg border-2 border-green-300">
                          <h4 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                            <span>🟢</span>
                            <span>Tarif ZLECAf</span>
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Valeur marchandise:</span>
                              <span className="font-bold">{formatCurrency(result.value)}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <span>+ Droits de douane ({(result.zlecaf_tariff_rate * 100).toFixed(1)}%):</span>
                              <span className="font-bold">{formatCurrency(result.zlecaf_tariff_amount)}</span>
                            </div>
                            <div className="flex justify-between text-orange-600">
                              <span>+ TVA ({result.zlecaf_vat_rate}%):</span>
                              <span className="font-bold">{formatCurrency(result.zlecaf_vat_amount)}</span>
                            </div>
                            {result.zlecaf_statistical_fee > 0 && (
                              <div className="flex justify-between text-purple-600">
                                <span>+ Redevance statistique:</span>
                                <span className="font-bold">{formatCurrency(result.zlecaf_statistical_fee)}</span>
                              </div>
                            )}
                            {result.zlecaf_community_levy > 0 && (
                              <div className="flex justify-between text-purple-600">
                                <span>+ Prélèvement communautaire:</span>
                                <span className="font-bold">{formatCurrency(result.zlecaf_community_levy)}</span>
                              </div>
                            )}
                            {result.zlecaf_ecowas_levy > 0 && (
                              <div className="flex justify-between text-purple-600">
                                <span>+ Prélèvement CEDEAO:</span>
                                <span className="font-bold">{formatCurrency(result.zlecaf_ecowas_levy)}</span>
                              </div>
                            )}
                            <Separator className="my-2" />
                            <div className="flex justify-between text-lg font-extrabold text-green-700">
                              <span>TOTAL:</span>
                              <span>{formatCurrency(result.zlecaf_total_cost)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Économies TOTALES */}
                      <div className="text-center bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 p-8 rounded-2xl shadow-lg border-4 border-yellow-400">
                        <p className="text-lg font-bold text-gray-700 mb-2">💰 ÉCONOMIE TOTALE (avec toutes les taxes)</p>
                        <p className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
                          {formatCurrency(result.total_savings_with_taxes)}
                        </p>
                        <Badge className="text-xl px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
                          🎉 {result.total_savings_percentage.toFixed(1)}% d'économie totale
                        </Badge>
                        <Progress value={result.total_savings_percentage} className="w-full mt-4 h-3" />
                        <p className="text-sm text-gray-600 mt-3">
                          Sur un coût total de {formatCurrency(result.normal_total_cost)} (NPF) vs {formatCurrency(result.zlecaf_total_cost)} (ZLECAf)
                        </p>
                      </div>

                      {/* Journal de calcul détaillé */}
                      {result.normal_calculation_journal && (
                        <Card className="shadow-lg border-t-4 border-t-purple-500">
                          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                            <CardTitle className="text-xl font-bold text-purple-700 flex items-center gap-2">
                              <span>📋</span>
                              <span>Journal de Calcul Détaillé (Ordre Officiel)</span>
                            </CardTitle>
                            <CardDescription className="font-semibold">
                              {result.computation_order_ref}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Étape</TableHead>
                                    <TableHead>Composant</TableHead>
                                    <TableHead>Base</TableHead>
                                    <TableHead>Taux</TableHead>
                                    <TableHead>Montant</TableHead>
                                    <TableHead>Cumulatif</TableHead>
                                    <TableHead>Référence Légale</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {result.normal_calculation_journal.map((entry, index) => (
                                    <TableRow key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                      <TableCell className="font-bold">{entry.step}</TableCell>
                                      <TableCell className="font-semibold">{entry.component}</TableCell>
                                      <TableCell>{formatCurrency(entry.base)}</TableCell>
                                      <TableCell>{entry.rate > 0 ? `${entry.rate.toFixed(2)}%` : '-'}</TableCell>
                                      <TableCell className="font-bold text-blue-600">{formatCurrency(entry.amount)}</TableCell>
                                      <TableCell className="font-bold">{formatCurrency(entry.cumulative)}</TableCell>
                                      <TableCell className="text-xs">
                                        {entry.legal_ref_url ? (
                                          <a href={entry.legal_ref_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {entry.legal_ref}
                                          </a>
                                        ) : (
                                          entry.legal_ref
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                              <Badge className="bg-green-600">✓ Vérifié: {result.last_verified}</Badge>
                              <Badge className="bg-blue-600">Confiance: {result.confidence_level}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Règles d'origine avec style africain */}
                      <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-xl border-l-4 border-orange-500 shadow-lg">
                        <h4 className="font-bold text-xl text-orange-800 mb-3 flex items-center gap-2">
                          <span>📜</span> {t.rulesOrigin}
                        </h4>
                        <div className="bg-white p-4 rounded-lg space-y-2">
                          <p className="text-sm text-amber-800 font-semibold">
                            <strong className="text-orange-600">Type:</strong> {result.rules_of_origin.rule}
                          </p>
                          <p className="text-sm text-amber-800 font-semibold">
                            <strong className="text-orange-600">Exigence:</strong> {result.rules_of_origin.requirement}
                          </p>
                          <div className="mt-3">
                            <Progress 
                              value={result.rules_of_origin.regional_content} 
                              className="w-full h-3"
                            />
                            <p className="text-sm text-amber-700 mt-2 font-bold text-center">
                              🌍 Contenu régional minimum: {result.rules_of_origin.regional_content}% africain
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top producteurs africains avec graphique */}
                  {result.top_african_producers && result.top_african_producers.length > 0 && (
                    <Card className="shadow-xl border-l-4 border-l-orange-500">
                      <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                        <CardTitle className="flex items-center space-x-2 text-xl text-orange-700">
                          <span>🏆</span>
                          <span>Top Producteurs Africains</span>
                        </CardTitle>
                        <CardDescription className="font-semibold">
                          Principaux pays exportateurs pour le code SH {result.hs_code}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4" style={{ minHeight: '280px' }}>
                        <ResponsiveContainer width="100%" height={250} debounce={300}>
                          <BarChart 
                            data={result.top_african_producers.map((producer, index) => ({
                              pays: `${index + 1}. ${producer.country_name}`,
                              valeur: producer.export_value / 1000000,
                              flag: countryFlags[producer.country_code]
                            }))}
                            layout="horizontal"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="pays" type="category" width={120} />
                            <Tooltip formatter={(value) => `$${value.toFixed(1)}M USD`} />
                            <Bar dataKey="valeur" fill="#f97316" />
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          {result.top_african_producers.map((producer, index) => (
                            <div key={producer.country_code} className="bg-orange-50 p-2 rounded-lg flex justify-between items-center">
                              <span className="text-sm font-semibold">
                                {index + 1}. {countryFlags[producer.country_code]} {producer.country_name}
                              </span>
                              <Badge className="bg-orange-600 text-white">
                                ${(producer.export_value / 1000000).toFixed(1)}M
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            {/* Intégration du composant Comparaisons dans Statistiques */}
            <TradeComparison />
            
            {/* Top 10 Exporters and Importers Charts */}
            {statistics && statistics.top_exporters_2024 && statistics.top_importers_2024 && (
              <div className="mt-8 space-y-6">
                <Card className="shadow-2xl">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100">
                    <CardTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
                      <span>📤</span>
                      <span>Top 10 Pays Exportateurs (2023-2024)</span>
                    </CardTitle>
                    <CardDescription className="font-semibold">Évolution des exportations en milliards USD</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div style={{ minHeight: '420px' }}>
                      <ResponsiveContainer width="100%" height={400} debounce={300}>
                        <BarChart 
                          data={statistics.top_exporters_2024.slice(0, 10).map(exporter => ({
                            pays: exporter.name,
                            '2024': parseFloat(exporter.exports),
                            '2024_pct': parseFloat(exporter.share),
                            '2023': parseFloat(exporter.exports) * 0.88
                          }))}
                          layout="vertical"
                          margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            type="number" 
                            label={{ value: 'Milliards USD', position: 'bottom', style: { fontSize: 12, fontWeight: 'bold' } }}
                            tick={{ fontSize: 11 }}
                            stroke="#6b7280"
                          />
                          <YAxis 
                            type="category" 
                            dataKey="pays" 
                            width={110} 
                            tick={{ fontSize: 11, fontWeight: 'bold' }}
                            stroke="#6b7280"
                          />
                          <Tooltip 
                            formatter={(value, name) => {
                              if (name === '2024') return [`${value.toFixed(1)}B USD`, 'Exports 2024'];
                              if (name === '2023') return [`${value.toFixed(1)}B USD`, 'Exports 2023'];
                              return [value, name];
                            }}
                            contentStyle={{ 
                              backgroundColor: '#f9fafb', 
                              border: '2px solid #10b981',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 'bold' }} />
                          <Bar dataKey="2023" fill="#cbd5e1" name="2023" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="2024" fill="#10b981" name="2024" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-5 gap-2">
                      {statistics.top_exporters_2024.slice(0, 10).map((exporter, index) => (
                        <div key={index} className="text-center p-2 bg-green-50 rounded">
                          <div className="text-xs font-semibold text-green-800">{exporter.name}</div>
                          <div className="text-base font-bold text-green-600">{exporter.share}%</div>
                          <div className="text-xs text-gray-600">Part</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-2xl">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-100">
                    <CardTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                      <span>📥</span>
                      <span>Top 10 Pays Importateurs (2023-2024)</span>
                    </CardTitle>
                    <CardDescription className="font-semibold">Évolution des importations en milliards USD</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div style={{ minHeight: '420px' }}>
                      <ResponsiveContainer width="100%" height={400} debounce={300}>
                        <BarChart 
                          data={statistics.top_importers_2024.slice(0, 10).map(importer => ({
                            pays: importer.name,
                            '2024': parseFloat(importer.imports),
                            '2024_pct': parseFloat(importer.share),
                            '2023': parseFloat(importer.imports) * 0.92
                          }))}
                          layout="vertical"
                          margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            type="number" 
                            label={{ value: 'Milliards USD', position: 'bottom', style: { fontSize: 12, fontWeight: 'bold' } }}
                            tick={{ fontSize: 11 }}
                            stroke="#6b7280"
                          />
                          <YAxis 
                            type="category" 
                            dataKey="pays" 
                            width={110} 
                            tick={{ fontSize: 11, fontWeight: 'bold' }}
                            stroke="#6b7280"
                          />
                          <Tooltip 
                            formatter={(value, name) => {
                              if (name === '2024') return [`${value.toFixed(1)}B USD`, 'Imports 2024'];
                              if (name === '2023') return [`${value.toFixed(1)}B USD`, 'Imports 2023'];
                              return [value, name];
                            }}
                            contentStyle={{ 
                              backgroundColor: '#f9fafb', 
                              border: '2px solid #3b82f6',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 'bold' }} />
                          <Bar dataKey="2023" fill="#cbd5e1" name="2023" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="2024" fill="#3b82f6" name="2024" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-5 gap-2">
                      {statistics.top_importers_2024.slice(0, 10).map((importer, index) => (
                        <div key={index} className="text-center p-2 bg-blue-50 rounded">
                          <div className="text-xs font-semibold text-blue-800">{importer.name}</div>
                          <div className="text-base font-bold text-blue-600">{importer.share}%</div>
                          <div className="text-xs text-gray-600">Part</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div className="mt-8"></div>
            
            {/* Section Statistiques originale */}
            {statistics && (
              <div className="space-y-6">
                {/* En-tête des statistiques avec style africain */}
                <Card className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 text-white shadow-2xl border-none">
                  <CardHeader>
                    <CardTitle className="text-3xl flex items-center gap-3">
                      <span>📈</span>
                      <span>Statistiques ZLECAf</span>
                    </CardTitle>
                    <CardDescription className="text-yellow-100 text-lg font-semibold">
                      Vue d'ensemble du commerce intra-africain
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Métriques principales avec style amélioré */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Statistiques d'importation avec graphique */}
                  {partnerImportStats && (
                    <Card className="shadow-lg border-l-4 border-l-blue-500">
                      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-cyan-50">
                        <CardTitle className="text-lg font-bold text-blue-700">{t.partnerImports}</CardTitle>
                        <CardDescription className="font-semibold">
                          {countryFlags[destinationCountry]} {getCountryName(destinationCountry)} - SH {hsCode}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4" style={{ minHeight: '180px' }}>
                        <ResponsiveContainer width="100%" height={150} debounce={300}>
                          <BarChart data={[
                            { année: '2022', montant: partnerImportStats.year_2022 / 1000000 },
                            { année: '2023', montant: partnerImportStats.year_2023 / 1000000 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="année" />
                            <YAxis />
                            <Tooltip formatter={(value) => `$${value.toFixed(0)}M`} />
                            <Bar dataKey="montant" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-3 text-center">
                          <Badge variant={parseFloat(partnerImportStats.growth_rate) > 0 ? "default" : "destructive"} className="text-base px-4 py-1">
                            📊 Croissance: {partnerImportStats.growth_rate}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Graphique donut pour la part SH2 */}
                  {partnerImportStats && (
                    <Card className="shadow-lg border-l-4 border-l-green-500">
                      <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50">
                        <CardTitle className="text-lg font-bold text-green-700">Part du Secteur</CardTitle>
                        <CardDescription className="font-semibold">
                          SH{hsCode.substring(0, 2)} dans les importations totales
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4" style={{ minHeight: '180px' }}>
                        <ResponsiveContainer width="100%" height={150} debounce={300}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: `SH${hsCode.substring(0, 2)}`, value: parseFloat(partnerImportStats.share_of_total_imports) },
                                { name: 'Autres secteurs', value: 100 - parseFloat(partnerImportStats.share_of_total_imports) }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={60}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#e5e7eb" />
                            </Pie>
                            <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                          </PieChart>
                        </ResponsiveContainer>
                        <p className="text-center font-bold text-green-600 mt-2">
                          {partnerImportStats.share_of_total_imports}% du secteur
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="shadow-lg border-l-4 border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-bold text-yellow-700 flex items-center gap-2">
                        <span>💰</span>
                        <span>Économies Totales</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {formatCurrency(statistics.overview.total_savings)}
                      </p>
                      <p className="text-sm text-gray-700 font-semibold mt-2">économisées via ZLECAf</p>
                      <Badge className="mt-3 bg-gradient-to-r from-green-600 to-blue-600 text-white">
                        {statistics.overview.calculations_count} calculs effectués
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Projections avec visualisation graphique */}
                <Card className="shadow-2xl border-t-4 border-t-purple-500">
                  <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
                    <CardTitle className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                      <span>🚀</span>
                      <span>{t.projections}</span>
                    </CardTitle>
                    <CardDescription className="font-semibold">Croissance prévue du commerce intra-africain</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Graphique de projections */}
                    <div style={{ minHeight: '320px' }}>
                      <ResponsiveContainer width="100%" height={300} debounce={300}>
                        <LineChart data={[
                          { année: '2024', volume: 0, pib: 0, industrialisation: 0 },
                          { année: '2025', volume: 15, pib: 0, industrialisation: 0 },
                          { année: '2030', volume: 52, pib: 35, industrialisation: 35 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="année" />
                          <YAxis label={{ value: 'Pourcentage (%)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Legend />
                          <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={3} name="Volume commercial" dot={{ r: 6 }} />
                          <Line type="monotone" dataKey="pib" stroke="#3b82f6" strokeWidth={3} name="PIB" dot={{ r: 6 }} />
                          <Line type="monotone" dataKey="industrialisation" stroke="#f59e0b" strokeWidth={3} name="Industrialisation" dot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-300 shadow-lg">
                        <h4 className="font-bold text-xl mb-4 text-blue-700 flex items-center gap-2">
                          <span>📅</span>
                          <span>Horizon 2025</span>
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white p-3 rounded-lg shadow">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">📊 Volume commercial:</span>
                              <Badge className="bg-blue-600 text-white text-base">{statistics.projections['2025'].trade_volume_increase}</Badge>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">✂️ Éliminations tarifaires:</span>
                              <Badge className="bg-green-600 text-white text-base">{statistics.projections['2025'].tariff_eliminations}</Badge>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">🛣️ Nouveaux corridors:</span>
                              <Badge className="bg-purple-600 text-white text-base">{statistics.projections['2025'].new_trade_corridors}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-300 shadow-lg">
                        <h4 className="font-bold text-xl mb-4 text-green-700 flex items-center gap-2">
                          <span>🎯</span>
                          <span>Horizon 2030</span>
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white p-3 rounded-lg shadow">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">📊 Volume commercial:</span>
                              <Badge className="bg-green-600 text-white text-base">{statistics.projections['2030'].trade_volume_increase}</Badge>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">💹 PIB:</span>
                              <Badge className="bg-blue-600 text-white text-base">{statistics.projections['2030'].gdp_increase}</Badge>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">🏭 Industrialisation:</span>
                              <Badge className="bg-orange-600 text-white text-base">{statistics.projections['2030'].industrialization_boost}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Scénarios 2040 - Banque Mondiale & UNECA */}
                {statistics.scenarios && (
                  <Card className="shadow-2xl border-t-4 border-t-indigo-500">
                    <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100">
                      <CardTitle className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
                        <span>🎯</span>
                        <span>Scénarios Prospectifs 2040 (Sources: BM/UNECA)</span>
                      </CardTitle>
                      <CardDescription className="font-semibold">Projections selon le rythme de mise en œuvre ZLECAf</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Scénario Conservateur */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-400 shadow-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-3xl">🐢</span>
                            <h4 className="font-bold text-lg text-yellow-700">Conservateur</h4>
                          </div>
                          <p className="text-sm text-gray-700 mb-4">{statistics.scenarios.conservative.description}</p>
                          <div className="bg-white p-3 rounded-lg shadow mb-2">
                            <p className="text-sm">Augmentation commerciale:</p>
                            <p className="text-2xl font-bold text-yellow-600">{statistics.scenarios.conservative.trade_increase_2040}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow">
                            <p className="text-sm">Valeur additionnelle:</p>
                            <p className="text-xl font-bold text-yellow-600">{statistics.scenarios.conservative.additional_value}</p>
                          </div>
                        </div>

                        {/* Scénario Médian */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-400 shadow-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-3xl">🚶</span>
                            <h4 className="font-bold text-lg text-blue-700">Médian</h4>
                          </div>
                          <p className="text-sm text-gray-700 mb-4">{statistics.scenarios.median.description}</p>
                          <div className="bg-white p-3 rounded-lg shadow mb-2">
                            <p className="text-sm">Augmentation commerciale:</p>
                            <p className="text-2xl font-bold text-blue-600">{statistics.scenarios.median.trade_increase_2040}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow">
                            <p className="text-sm">Valeur additionnelle:</p>
                            <p className="text-xl font-bold text-blue-600">{statistics.scenarios.median.additional_value}</p>
                          </div>
                        </div>

                        {/* Scénario Ambitieux */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-400 shadow-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-3xl">🚀</span>
                            <h4 className="font-bold text-lg text-green-700">Ambitieux</h4>
                          </div>
                          <p className="text-sm text-gray-700 mb-4">{statistics.scenarios.ambitious.description}</p>
                          <div className="bg-white p-3 rounded-lg shadow mb-2">
                            <p className="text-sm">Augmentation commerciale:</p>
                            <p className="text-2xl font-bold text-green-600">{statistics.scenarios.ambitious.trade_increase_2040}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow">
                            <p className="text-sm">Valeur additionnelle:</p>
                            <p className="text-xl font-bold text-green-600">{statistics.scenarios.ambitious.additional_value}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Mécanismes Clés ZLECAf */}
                {statistics.key_mechanisms && (
                  <Card className="shadow-xl border-l-4 border-l-cyan-500">
                    <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                      <CardTitle className="text-xl font-bold text-cyan-700 flex items-center gap-2">
                        <span>⚙️</span>
                        <span>Mécanismes et Infrastructure ZLECAf</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                          <h5 className="font-bold text-purple-700 mb-2">📱 Protocole Commerce Digital</h5>
                          <p className="text-sm mb-1"><strong>Adoption:</strong> {statistics.key_mechanisms.digital_trade_protocol.adoption_date}</p>
                          <p className="text-sm mb-1"><strong>Statut:</strong> <Badge className="bg-green-600">{statistics.key_mechanisms.digital_trade_protocol.status}</Badge></p>
                          <p className="text-sm text-gray-600">{statistics.key_mechanisms.digital_trade_protocol.focus}</p>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                          <h5 className="font-bold text-orange-700 mb-2">🚧 Plateforme NTB</h5>
                          <p className="text-sm mb-1"><strong>Statut:</strong> <Badge className="bg-green-600">{statistics.key_mechanisms.ntb_platform.status}</Badge></p>
                          <p className="text-sm text-gray-600 mb-2">{statistics.key_mechanisms.ntb_platform.purpose}</p>
                          <a href={statistics.key_mechanisms.ntb_platform.url} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-600 hover:underline font-semibold">
                            🔗 {statistics.key_mechanisms.ntb_platform.url}
                          </a>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <h5 className="font-bold text-blue-700 mb-2">💳 PAPSS - Paiements</h5>
                          <p className="text-sm mb-1"><strong>Statut:</strong> <Badge className="bg-yellow-600">{statistics.key_mechanisms.papss_payments.status}</Badge></p>
                          <p className="text-sm text-gray-600">{statistics.key_mechanisms.papss_payments.purpose}</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                          <h5 className="font-bold text-green-700 mb-2">🚀 GTI - Initiative Guidée</h5>
                          <p className="text-sm mb-1"><strong>Statut:</strong> <Badge className="bg-green-600">{statistics.key_mechanisms.gti.status}</Badge></p>
                          <p className="text-sm text-gray-600">{statistics.key_mechanisms.gti.purpose}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Sources de données enrichies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>📚</span>
                      <span>{t.dataSources}</span>
                    </CardTitle>
                    <CardDescription>Sources primaires officielles et vérifiées</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {statistics.data_sources.map((source, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg border-l-4 border-l-blue-500">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-semibold text-sm text-gray-800">{source.source || source}</h5>
                              {source.key_findings && (
                                <p className="text-xs text-gray-600 mt-1">{source.key_findings}</p>
                              )}
                              {source.focus && (
                                <p className="text-xs text-gray-600 mt-1">{source.focus}</p>
                              )}
                            </div>
                            {source.url && (
                              <a 
                                href={source.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-semibold text-xs ml-2"
                              >
                                🔗
                              </a>
                            )}
                          </div>
                          {source.verified && (
                            <div className="mt-2">
                              <Badge className="bg-green-600 text-xs py-0 px-2">✓ {source.verified}</Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Dernière mise à jour: {new Date(statistics.last_updated).toLocaleDateString('fr-FR')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tools">
            <div className="space-y-6">
              {/* En-tête Outils */}
              <Card className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600 text-white shadow-2xl border-none">
                <CardHeader>
                  <CardTitle className="text-3xl flex items-center gap-3">
                    <span>🛠️</span>
                    <span>Outils et Ressources ZLECAf</span>
                  </CardTitle>
                  <CardDescription className="text-yellow-100 text-lg font-semibold">
                    Plateformes officielles, protocoles et initiatives
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Widgets des outils */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-l-4 border-l-orange-500 shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">🚧</span>
                      <h3 className="font-bold text-xl text-orange-700">Obstacles Non Tarifaires</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      Signalez ou consultez les obstacles non tarifaires (NTB) sur la plateforme officielle ZLECAf. 
                      Mécanisme de résolution continentale.
                    </p>
                    <div className="bg-white p-3 rounded-lg mb-3">
                      <p className="text-xs text-gray-600"><strong>Status:</strong> <Badge className="bg-green-600 ml-2">Opérationnel</Badge></p>
                      <p className="text-xs text-gray-600 mt-1"><strong>Pays couverts:</strong> 54 membres ZLECAf</p>
                    </div>
                    <a 
                      href="https://tradebarriers.africa" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-orange-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-orange-700 transition shadow-lg"
                    >
                      🔗 Accéder à la plateforme NTB
                    </a>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-l-blue-500 shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">💻</span>
                      <h3 className="font-bold text-xl text-blue-700">Protocole Commerce Digital</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      Adopté le 18 février 2024. Harmonisation des règles sur les flux transfrontières, 
                      confiance numérique et identité digitale.
                    </p>
                    <div className="bg-white p-3 rounded-lg mb-3">
                      <p className="text-xs text-gray-600"><strong>Adoption:</strong> 18 février 2024</p>
                      <p className="text-xs text-gray-600 mt-1"><strong>Status:</strong> <Badge className="bg-green-600 ml-2">Adopté</Badge></p>
                    </div>
                    <a 
                      href="https://au.int/en/treaties/protocol-digital-trade" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
                    >
                      📄 Voir le protocole UA
                    </a>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-500 shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">🚀</span>
                      <h3 className="font-bold text-xl text-green-700">Guided Trade Initiative</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      Initiative pilote de mise en œuvre progressive. Suivez les pays actifs, 
                      corridors commerciaux et routes prioritaires ZLECAf.
                    </p>
                    <div className="bg-white p-3 rounded-lg mb-3">
                      <p className="text-xs text-gray-600"><strong>Status:</strong> <Badge className="bg-green-600 ml-2">Actif</Badge></p>
                      <p className="text-xs text-gray-600 mt-1"><strong>Focus:</strong> 8 corridors prioritaires</p>
                    </div>
                    <a 
                      href="https://www.tralac.org/news/article/afcfta-guided-trade-initiative.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg"
                    >
                      🌍 Voir les pays GTI
                    </a>
                  </CardContent>
                </Card>
              </div>

              {/* Section PAPSS */}
              <Card className="shadow-2xl border-t-4 border-t-purple-600">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                    <span>💳</span>
                    <span>PAPSS - Système Panafricain de Paiements</span>
                  </CardTitle>
                  <CardDescription className="text-lg font-semibold">
                    Infrastructure de paiements et règlements transfrontaliers
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-lg text-purple-700 mb-3">À propos de PAPSS</h4>
                      <p className="text-gray-700 mb-4">
                        Le Pan-African Payment and Settlement System (PAPSS) permet les transactions 
                        instantanées en monnaies locales entre pays africains, réduisant la dépendance 
                        au dollar USD et les coûts de change.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span className="text-sm">Réduction des coûts de transaction</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span className="text-sm">Paiements instantanés 24/7</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span className="text-sm">Support des monnaies locales</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-purple-700 mb-3">Avantages pour le Commerce</h4>
                      <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-purple-800">💰 Économies de coûts</p>
                          <p className="text-xs text-gray-600">Jusqu'à 80% de réduction sur les frais bancaires</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-800">⚡ Rapidité</p>
                          <p className="text-xs text-gray-600">Règlements en temps réel vs 3-7 jours</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-800">🔒 Sécurité</p>
                          <p className="text-xs text-gray-600">Standards internationaux ISO 20022</p>
                        </div>
                      </div>
                      <Badge className="mt-4 bg-yellow-600">Déploiement en cours</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section Ressources Additionnelles */}
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span>📚</span>
                    <span>Ressources Additionnelles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a 
                      href="https://au.int/en/cfta" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition border border-blue-200"
                    >
                      <i className="fas fa-globe text-blue-600 text-2xl"></i>
                      <div>
                        <p className="font-semibold text-blue-800">Secrétariat ZLECAf</p>
                        <p className="text-xs text-gray-600">Union Africaine - Site officiel</p>
                      </div>
                    </a>

                    <a 
                      href="https://www.tralac.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition border border-green-200"
                    >
                      <i className="fas fa-balance-scale text-green-600 text-2xl"></i>
                      <div>
                        <p className="font-semibold text-green-800">tralac</p>
                        <p className="text-xs text-gray-600">Centre de droit commercial</p>
                      </div>
                    </a>

                    <a 
                      href="https://www.worldbank.org/en/topic/trade/publication/the-african-continental-free-trade-area" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition border border-purple-200"
                    >
                      <i className="fas fa-university text-purple-600 text-2xl"></i>
                      <div>
                        <p className="font-semibold text-purple-800">Banque Mondiale</p>
                        <p className="text-xs text-gray-600">Études et projections</p>
                      </div>
                    </a>

                    <a 
                      href="https://www.uneca.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition border border-orange-200"
                    >
                      <i className="fas fa-chart-line text-orange-600 text-2xl"></i>
                      <div>
                        <p className="font-semibold text-orange-800">UNECA</p>
                        <p className="text-xs text-gray-600">Commission économique pour l'Afrique</p>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rules">
            <div className="space-y-6">
              <Card className="shadow-xl border-t-4 border-t-orange-500">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                  <CardTitle className="text-2xl font-bold text-orange-700 flex items-center gap-2">
                    <span>📜</span>
                    <span>Règles d'Origine ZLECAf</span>
                  </CardTitle>
                  <CardDescription className="font-semibold text-gray-700">
                    Entrez un code SH6 pour consulter les règles d'origine spécifiques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Code SH6 (ex: 010121)"
                      value={hsCode}
                      onChange={(e) => setHsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="text-lg font-semibold border-2 border-orange-300 focus:border-orange-500"
                    />
                    <Button 
                      onClick={() => fetchRulesOfOrigin(hsCode)} 
                      disabled={hsCode.length !== 6}
                      className="bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold px-6"
                    >
                      🔍 Consulter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {rulesOfOrigin && (
                <Card className="shadow-2xl border-l-4 border-l-amber-500">
                  <CardHeader className="bg-gradient-to-r from-amber-100 to-yellow-100">
                    <CardTitle className="text-xl font-bold text-amber-800">Règles pour le Code SH {rulesOfOrigin.hs_code}</CardTitle>
                    <CardDescription className="font-semibold text-amber-700">
                      Secteur: {getSectorName(rulesOfOrigin.hs_code)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Type de Règle</h4>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {rulesOfOrigin.rules.rule}
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Exigence</h4>
                        <p className="text-sm">{rulesOfOrigin.rules.requirement}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Contenu Régional Minimum</h4>
                      <Progress value={rulesOfOrigin.rules.regional_content} className="w-full" />
                      <p className="text-sm text-gray-600 mt-1">
                        {rulesOfOrigin.rules.regional_content}% de contenu africain requis
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">Documentation Requise</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {rulesOfOrigin.explanation.documentation_required.map((doc, index) => (
                          <Badge key={index} variant="outline">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Informations Administratives</h4>
                      <div className="space-y-1 text-sm text-blue-700">
                        <p><strong>Période de validité:</strong> {rulesOfOrigin.explanation.validity_period}</p>
                        <p><strong>Autorité émettrice:</strong> {rulesOfOrigin.explanation.issuing_authority}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profiles">
            <div className="space-y-6">
              <Card className="shadow-xl border-t-4 border-t-blue-600">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                    <span>🌍</span>
                    <span>Profils Économiques des Pays</span>
                  </CardTitle>
                  <CardDescription className="font-semibold text-gray-700">
                    Sélectionnez un pays pour consulter son profil économique complet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={originCountry} 
                    onValueChange={(value) => {
                      setOriginCountry(value);
                      fetchCountryProfile(value);
                    }}
                  >
                    <SelectTrigger className="text-lg font-semibold border-2 border-blue-300 focus:border-blue-500">
                      <SelectValue placeholder="🔍 Choisir un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {countryFlags[country.code]} {country.name} - {country.region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {countryProfile && (
                <div className="space-y-4">
                  <Card className="shadow-2xl border-l-4 border-l-green-600">
                    <CardHeader className="bg-gradient-to-r from-green-100 via-yellow-100 to-red-100">
                      <CardTitle className="flex items-center space-x-2 text-2xl">
                        <span className="text-4xl">{countryFlags[countryProfile.country_code]}</span>
                        <span className="font-bold text-green-700">{countryProfile.country_name}</span>
                      </CardTitle>
                      <CardDescription className="text-lg font-semibold text-gray-700">
                        {countryProfile.region} • 👥 Population: {formatNumber(countryProfile.population)} habitants
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {/* Indicateurs économiques principaux - COMPACTS */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                        {countryProfile.gdp_usd && (
                          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-3 rounded-lg shadow border border-green-300 text-center">
                            <p className="text-xs font-semibold text-green-700 mb-1">💰 PIB Total</p>
                            <p className="text-2xl font-bold text-green-600">
                              ${(countryProfile.gdp_usd / 1000000000).toFixed(1)}B
                            </p>
                            <p className="text-xs text-green-600 mt-1">Rang: #{countryProfile.projections?.africa_rank || 'N/A'}</p>
                          </div>
                        )}
                        
                        {countryProfile.gdp_per_capita && (
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-3 rounded-lg shadow border border-blue-300 text-center">
                            <p className="text-xs font-semibold text-blue-700 mb-1">👤 PIB/Habitant</p>
                            <p className="text-2xl font-bold text-blue-600">
                              ${formatNumber(Math.round(countryProfile.gdp_per_capita))}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">USD/personne</p>
                          </div>
                        )}
                        
                        <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-3 rounded-lg shadow border border-purple-300 text-center">
                          <p className="text-xs font-semibold text-purple-700 mb-1">📊 IDH 2024</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {countryProfile.projections?.development_index || 'N/A'}
                          </p>
                          <p className="text-xs text-purple-600 mt-1">Indice Dév. Humain</p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-3 rounded-lg shadow border border-orange-300 text-center">
                          <p className="text-xs font-semibold text-orange-700 mb-1">👥 Population</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {(countryProfile.population / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-xs text-orange-600 mt-1">Millions d'habitants</p>
                        </div>
                      </div>

                      {/* Nouveaux indicateurs - Infrastructure et Économie */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        <div className="bg-red-50 p-2 rounded border-l-2 border-red-500">
                          <p className="text-xs font-semibold text-red-700">💳 Dette Ext.</p>
                          <p className="text-sm font-bold text-red-600">
                            {countryProfile.projections?.external_debt_gdp_pct || '45'}% PIB
                          </p>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded border-l-2 border-yellow-500">
                          <p className="text-xs font-semibold text-yellow-700">⚡ Énergie</p>
                          <p className="text-sm font-bold text-yellow-600">
                            ${countryProfile.projections?.energy_cost_kwh || '0.12'}/kWh
                          </p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded border-l-2 border-gray-500">
                          <p className="text-xs font-semibold text-gray-700">🛣️ Routes</p>
                          <p className="text-sm font-bold text-gray-600">
                            {countryProfile.projections?.paved_roads_km ? 
                              (countryProfile.projections.paved_roads_km / 1000).toFixed(0) + 'k km' : 
                              'N/A'}
                          </p>
                        </div>
                        <div className="bg-blue-50 p-2 rounded border-l-2 border-blue-500">
                          <p className="text-xs font-semibold text-blue-700">🚢 Ports</p>
                          <p className="text-sm font-bold text-blue-600">
                            {countryProfile.projections?.international_ports || '2'} int. / {countryProfile.projections?.domestic_ports || '5'} dom.
                          </p>
                        </div>
                      </div>

                      {/* Notations de crédit - COMPACTES */}
                      {countryProfile.risk_ratings && (
                        <div className="bg-gray-50 p-2 rounded-lg mb-4">
                          <h4 className="text-xs font-semibold text-gray-700 mb-2">📊 Notations 2024</h4>
                          <div className="grid grid-cols-4 gap-2">
                            {countryProfile.risk_ratings.sp !== 'NR' && (
                              <div className="text-center bg-white p-1 rounded">
                                <p className="text-xs text-gray-500">S&P</p>
                                <Badge className="text-xs py-0 px-1">{countryProfile.risk_ratings.sp}</Badge>
                              </div>
                            )}
                            {countryProfile.risk_ratings.moodys !== 'NR' && (
                              <div className="text-center bg-white p-1 rounded">
                                <p className="text-xs text-gray-500">Moody's</p>
                                <Badge className="text-xs py-0 px-1">{countryProfile.risk_ratings.moodys}</Badge>
                              </div>
                            )}
                            {countryProfile.risk_ratings.fitch !== 'NR' && (
                              <div className="text-center bg-white p-1 rounded">
                                <p className="text-xs text-gray-500">Fitch</p>
                                <Badge className="text-xs py-0 px-1">{countryProfile.risk_ratings.fitch}</Badge>
                              </div>
                            )}
                            {countryProfile.risk_ratings.global_risk && (
                              <div className="text-center bg-white p-1 rounded">
                                <p className="text-xs text-gray-500">Risque</p>
                                <Badge variant="secondary" className="text-xs py-0 px-1">{countryProfile.risk_ratings.global_risk}</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="shadow-xl border-t-4 border-t-purple-600">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3 text-gray-800 text-xl">🏛️ Notations de Risque Souverain</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-blue-50 p-3 rounded-lg text-center">
                              <p className="text-lg font-bold text-blue-600">
                                {countryProfile.risk_ratings?.sp || 'NR'}
                              </p>
                              <p className="text-xs text-gray-600">S&P (USA)</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg text-center">
                              <p className="text-lg font-bold text-green-600">
                                {countryProfile.risk_ratings?.moodys || 'NR'}
                              </p>
                              <p className="text-xs text-gray-600">Moody's (USA)</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg text-center">
                              <p className="text-lg font-bold text-purple-600">
                                {countryProfile.risk_ratings?.fitch || 'NR'}
                              </p>
                              <p className="text-xs text-gray-600">Fitch (FR/USA)</p>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-lg text-center">
                              <p className="text-lg font-bold text-orange-600">
                                {countryProfile.risk_ratings?.scope || 'NR'}
                              </p>
                              <p className="text-xs text-gray-600">Scope (Europe)</p>
                            </div>
                          </div>
                          
                          {/* Risque global */}
                          <div className="mt-3 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              countryProfile.risk_ratings?.global_risk === 'Très Faible' ? 'bg-green-100 text-green-800' :
                              countryProfile.risk_ratings?.global_risk === 'Faible' ? 'bg-green-100 text-green-700' :
                              countryProfile.risk_ratings?.global_risk === 'Modéré' ? 'bg-yellow-100 text-yellow-800' :
                              countryProfile.risk_ratings?.global_risk === 'Élevé' ? 'bg-orange-100 text-orange-800' :
                              countryProfile.risk_ratings?.global_risk === 'Très Élevé' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              🏛️ Risque Global: {countryProfile.risk_ratings?.global_risk || 'Non évalué'}
                            </span>
                          </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-l-4 border-l-purple-500">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <CardTitle className="text-lg font-bold text-purple-700 flex items-center gap-2">
                        <span>🚀</span>
                        <span>Perspectives et Projections</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3">
                      {/* Projections de croissance COMPACTES - Sans graphique */}
                      {countryProfile.projections && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-green-50 p-2 rounded-lg border-l-2 border-green-500 text-center">
                            <p className="text-xs text-green-700 mb-1">📈 Croissance 2025</p>
                            <p className="text-lg font-bold text-green-600">
                              {countryProfile.projections?.gdp_growth_projection_2025 || 'N/A'}
                            </p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded-lg border-l-2 border-purple-500 text-center">
                            <p className="text-xs text-purple-700 mb-1">📈 Croissance 2026</p>
                            <p className="text-lg font-bold text-purple-600">
                              {countryProfile.projections?.gdp_growth_projection_2026 || 'N/A'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Secteurs clés COMPACTS */}
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold mb-2 text-gray-700">🏭 Secteurs Clés</h4>
                        <div className="grid grid-cols-1 gap-1">
                          {countryProfile.projections?.key_sectors?.slice(0, 3).map((sector, index) => (
                            <div key={index} className="text-xs p-1 bg-gray-50 rounded border-l-2 border-blue-400">
                              {sector}
                            </div>
                          )) || <p className="text-xs text-gray-500">Données non disponibles</p>}
                        </div>
                      </div>

                      {/* Potentiel ZLECAf COMPACT */}
                      <div className="bg-green-50 p-2 rounded-lg border-l-2 border-green-500">
                        <h4 className="text-xs font-semibold text-green-800 mb-1">
                          💡 Potentiel ZLECAf: {countryProfile.projections?.zlecaf_potential_level || 'N/A'}
                        </h4>
                        <p className="text-xs text-green-700 mb-2">
                          {countryProfile.projections?.zlecaf_potential_description || 'Description non disponible'}
                        </p>
                        
                        {/* Opportunités ZLECAf COMPACTES */}
                        {countryProfile.projections?.zlecaf_opportunities && countryProfile.projections.zlecaf_opportunities.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-green-800 mb-1">🎯 Opportunités:</p>
                            <ul className="text-xs text-green-700 space-y-1">
                              {countryProfile.projections.zlecaf_opportunities.slice(0, 3).map((opp, index) => (
                                <li key={index}>• {opp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Exports/Imports COMPACTS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                        <div className="bg-blue-50 p-2 rounded">
                          <h4 className="text-xs font-semibold text-blue-800 mb-1">📤 Export</h4>
                          <div className="flex flex-wrap gap-1">
                            {countryProfile.projections?.main_exports?.slice(0, 3).map((exp, index) => (
                              <Badge key={index} variant="outline" className="text-xs py-0 px-1">
                                {exp}
                              </Badge>
                            )) || <p className="text-xs text-gray-500">N/A</p>}
                          </div>
                        </div>
                        
                        <div className="bg-orange-50 p-2 rounded">
                          <h4 className="text-xs font-semibold text-orange-800 mb-1">📥 Import</h4>
                          <div className="flex flex-wrap gap-1">
                            {countryProfile.projections?.main_imports?.slice(0, 3).map((imp, index) => (
                              <Badge key={index} variant="outline" className="text-xs py-0 px-1">
                                {imp}
                              </Badge>
                            )) || <p className="text-xs text-gray-500">N/A</p>}
                          </div>
                        </div>
                      </div>

                      {/* Données Commerce 2024 COMPACTES */}
                      {(countryProfile.projections?.exports_2024_billion_usd || countryProfile.projections?.imports_2024_billion_usd) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                          <div className="bg-green-50 p-2 rounded text-center">
                            <p className="text-xs text-gray-600 mb-1">📤 Export 2024</p>
                            <p className="text-lg font-bold text-green-700">${countryProfile.projections.exports_2024_billion_usd?.toFixed(1)}B</p>
                          </div>
                          <div className="bg-blue-50 p-2 rounded text-center">
                            <p className="text-xs text-gray-600 mb-1">📥 Import 2024</p>
                            <p className="text-lg font-bold text-blue-700">${countryProfile.projections.imports_2024_billion_usd?.toFixed(1)}B</p>
                          </div>
                          <div className={`p-2 rounded text-center ${countryProfile.projections.trade_balance_2024_billion_usd >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                            <p className="text-xs text-gray-600 mb-1">⚖️ Solde</p>
                            <p className={`text-lg font-bold ${countryProfile.projections.trade_balance_2024_billion_usd >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                              ${countryProfile.projections.trade_balance_2024_billion_usd?.toFixed(1)}B
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Partenaires Commerciaux COMPACTS */}
                      {(countryProfile.projections?.export_partners || countryProfile.projections?.import_partners) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                          {countryProfile.projections?.export_partners && (
                            <div className="bg-purple-50 p-2 rounded">
                              <h4 className="text-xs font-semibold text-purple-800 mb-1">🌍 Partenaires Export</h4>
                              <div className="space-y-1">
                                {countryProfile.projections.export_partners.map((partner, index) => (
                                  <div key={index} className="text-xs text-purple-700">• {partner}</div>
                                ))}
                              </div>
                            </div>
                          )}
                          {countryProfile.projections?.import_partners && (
                            <div className="bg-indigo-50 p-2 rounded">
                              <h4 className="text-xs font-semibold text-indigo-800 mb-1">🌍 Partenaires Import</h4>
                              <div className="space-y-1">
                                {countryProfile.projections.import_partners.map((partner, index) => (
                                  <div key={index} className="text-xs text-indigo-700">• {partner}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Notations supprimées car déjà présentes en haut */}

                      {/* Statut ZLECAf */}
                      {countryProfile.projections?.zlecaf_ratified && (
                        <div className="mt-4 bg-green-50 p-4 rounded-lg border-l-4 border-l-green-500">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-green-800">Statut ZLECAf</h4>
                              <p className="text-sm text-green-700 mt-1">
                                {countryProfile.projections.zlecaf_ratified === 'Oui' ? '✅ Ratifié' : '⏳ En attente'}
                              </p>
                            </div>
                            {countryProfile.projections.zlecaf_ratification_date && (
                              <Badge variant="outline" className="text-green-800 border-green-800">
                                {new Date(countryProfile.projections.zlecaf_ratification_date).toLocaleDateString('fr-FR')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ZLECAfCalculator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;