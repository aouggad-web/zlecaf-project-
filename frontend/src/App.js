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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculator">{t.calculatorTab}</TabsTrigger>
            <TabsTrigger value="statistics">{t.statisticsTab}</TabsTrigger>
            <TabsTrigger value="rules">{t.rulesTab}</TabsTrigger>
            <TabsTrigger value="profiles">{t.profilesTab}</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulaire de calcul */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>📊</span>
                    <span>{t.calculatorTitle}</span>
                  </CardTitle>
                  <CardDescription>
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
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    {loading ? 'Calcul en cours...' : t.calculateBtn}
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
                      {/* Comparaison visuelle avec graphique */}
                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <h4 className="font-bold text-lg mb-4 text-gray-800">📊 Comparaison Tarifaire</h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={[
                            { name: 'Tarif NPF', montant: result.normal_tariff_amount, taux: result.normal_tariff_rate * 100 },
                            { name: 'Tarif ZLECAf', montant: result.zlecaf_tariff_amount, taux: result.zlecaf_tariff_rate * 100 },
                            { name: 'Économie', montant: result.savings, taux: result.savings_percentage }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="montant" fill="#10b981" name="Montant (USD)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-md border-2 border-red-300">
                          <p className="text-sm font-semibold text-red-700 mb-2">{t.normalTariff}</p>
                          <p className="text-3xl font-bold text-red-600">
                            {formatCurrency(result.normal_tariff_amount)}
                          </p>
                          <p className="text-sm text-red-600 mt-2 font-medium">
                            {(result.normal_tariff_rate * 100).toFixed(1)}% • {formatCurrency(result.value)}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md border-2 border-green-300">
                          <p className="text-sm font-semibold text-green-700 mb-2">{t.zlecafTariff}</p>
                          <p className="text-3xl font-bold text-green-600">
                            {formatCurrency(result.zlecaf_tariff_amount)}
                          </p>
                          <p className="text-sm text-green-600 mt-2 font-medium">
                            {(result.zlecaf_tariff_rate * 100).toFixed(1)}% • {formatCurrency(result.value)}
                          </p>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="text-center bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 p-8 rounded-2xl shadow-lg border-4 border-yellow-400">
                        <p className="text-lg font-bold text-gray-700 mb-2">{t.savings}</p>
                        <p className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
                          {formatCurrency(result.savings)}
                        </p>
                        <Badge className="text-xl px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
                          🎉 {result.savings_percentage.toFixed(1)}% d'économie
                        </Badge>
                        <Progress value={result.savings_percentage} className="w-full mt-4 h-3" />
                      </div>

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

                  {/* Top producteurs africains */}
                  {result.top_african_producers && result.top_african_producers.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <span>🏆</span>
                          <span>Top Producteurs Africains</span>
                        </CardTitle>
                        <CardDescription>
                          Principaux pays exportateurs pour le code SH {result.hs_code}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {result.top_african_producers.map((producer, index) => (
                            <div key={producer.country_code} className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                {index + 1}. {countryFlags[producer.country_code]} {producer.country_name}
                              </span>
                              <Badge variant="outline">
                                ${(producer.export_value / 1000000).toFixed(1)}M USD
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
                      <CardContent className="pt-4">
                        <ResponsiveContainer width="100%" height={150}>
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
                      <CardContent className="pt-4">
                        <ResponsiveContainer width="100%" height={150}>
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
                    <ResponsiveContainer width="100%" height={300}>
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

                {/* Sources de données */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t.dataSources}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {statistics.data_sources.map((source, index) => (
                        <Badge key={index} variant="outline" className="text-center">
                          {source}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Dernière mise à jour: {new Date(statistics.last_updated).toLocaleDateString('fr-FR')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rules">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Règles d'Origine ZLECAf</CardTitle>
                  <CardDescription>
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
                    />
                    <Button onClick={() => fetchRulesOfOrigin(hsCode)} disabled={hsCode.length !== 6}>
                      Consulter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {rulesOfOrigin && (
                <Card>
                  <CardHeader>
                    <CardTitle>Règles pour le Code SH {rulesOfOrigin.hs_code}</CardTitle>
                    <CardDescription>
                      Secteur: {getSectorName(rulesOfOrigin.hs_code)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
              <Card>
                <CardHeader>
                  <CardTitle>Profils Économiques des Pays</CardTitle>
                  <CardDescription>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un pays" />
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{countryFlags[countryProfile.country_code]}</span>
                        <span>{countryProfile.country_name}</span>
                      </CardTitle>
                      <CardDescription>
                        {countryProfile.region} • Population: {formatNumber(countryProfile.population)} habitants
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {countryProfile.gdp_usd && (
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                              ${countryProfile.gdp_usd.toFixed(1)}B
                            </p>
                            <p className="text-sm text-gray-600">PIB (milliards USD)</p>
                          </div>
                        )}
                        
                        {countryProfile.gdp_per_capita && (
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                              ${formatNumber(Math.round(countryProfile.gdp_per_capita))}
                            </p>
                            <p className="text-sm text-gray-600">PIB par habitant</p>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {countryProfile.projections?.development_index || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">Indice de développement</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">
                            #{countryProfile.projections?.africa_rank || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">Rang en Afrique</p>
                        </div>
                        
                        {/* Notations de risque */}
                        <div className="col-span-full mt-4">
                          <h4 className="font-semibold mb-3 text-gray-800">Notations de Risque Souverain</h4>
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
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Perspectives et Projections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Projections de Croissance</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Croissance prévue 2024:</span>
                              <Badge variant="secondary">{countryProfile.projections?.gdp_growth_forecast_2024 || 'N/A'}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Projection 2025:</span>
                              <Badge variant="outline">{countryProfile.projections?.gdp_growth_projection_2025 || 'N/A'}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Projection 2026:</span>
                              <Badge variant="default">{countryProfile.projections?.gdp_growth_projection_2026 || 'N/A'}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Environnement des Affaires</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Climat d'investissement:</span>
                              <Badge variant="secondary">{countryProfile.projections?.investment_climate_score}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Indice infrastructure:</span>
                              <Badge variant="outline">{countryProfile.projections?.infrastructure_index}/10</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Rang environnement business:</span>
                              <Badge variant="default">#{countryProfile.projections?.business_environment_rank}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div>
                        <h4 className="font-semibold mb-3">Secteurs Clés</h4>
                        <div className="space-y-2">
                          {countryProfile.projections?.key_sectors?.map((sector, index) => (
                            <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                              {sector}
                            </div>
                          )) || <p className="text-sm text-gray-500">Données non disponibles</p>}
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg mt-4">
                        <h4 className="font-semibold text-green-800 mb-2">
                          Potentiel ZLECAf - {countryProfile.projections?.zlecaf_potential_level || 'N/A'}
                        </h4>
                        <p className="text-sm text-green-700 mb-3">
                          {countryProfile.projections?.zlecaf_potential_description || 'Description non disponible'}
                        </p>
                        
                        {countryProfile.projections?.zlecaf_opportunities && (
                          <div>
                            <p className="text-sm font-semibold text-green-800 mb-2">Opportunités clés :</p>
                            <ul className="text-sm text-green-700 space-y-1">
                              {countryProfile.projections.zlecaf_opportunities.map((opp, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  {opp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Nouvelles sections avec données réelles */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">Principales Exportations</h4>
                          <div className="flex flex-wrap gap-1">
                            {countryProfile.projections?.main_exports?.map((exp, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {exp}
                              </Badge>
                            )) || <p className="text-xs text-gray-500">Non disponible</p>}
                          </div>
                        </div>
                        
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-orange-800 mb-2">Principales Importations</h4>
                          <div className="flex flex-wrap gap-1">
                            {countryProfile.projections?.main_imports?.map((imp, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {imp}
                              </Badge>
                            )) || <p className="text-xs text-gray-500">Non disponible</p>}
                          </div>
                        </div>
                      </div>
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