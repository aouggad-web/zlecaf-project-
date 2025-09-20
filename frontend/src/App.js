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
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Données enrichies basées sur la référence zlecaf.online
const REFERENCE_PRODUCTS = {
  '150910': "Huile d'olive, vierge",
  '220210': 'Eaux sucrées (non alco.)',
  '100590': 'Maïs (non semence)',
  '100630': 'Riz blanchi',
  '090111': 'Café, non torréfié',
  '090240': 'Thé noir',
  '180690': 'Chocolat & préparations cacao',
  '310210': 'Urée',
  '252329': 'Ciment Portland',
  '392330': 'Bouteilles plastique',
  '441113': 'MDF >9mm',
  '940360': 'Meubles bois',
  '711311': 'Bijoux en argent',
  '760200': "Déchets d'aluminium",
  '730890': 'Structures acier',
  '850440': 'Convertisseurs statiques',
  '854140': 'Panneaux PV',
  '870332': 'Voitures 1500-3000cc',
  '870421': 'Camions <=5t',
  '300490': 'Médicaments dosés',
  '010121': 'Chevaux reproducteurs',
  '180100': 'Fèves de cacao'
};

const REFERENCE_PSR = {
  '150910': { rule: 'CC ou CTH + VCR minimal', type: 'CC/CTH + VCR', rvc: 25 },
  '220210': { rule: 'CTH ou VCR 60%', type: 'CTH/VCR', rvc: 60 },
  '100590': { rule: 'WO (totalement obtenu)', type: 'WO', rvc: null },
  '100630': { rule: 'CTH + VCR 40%', type: 'CTH + VCR', rvc: 40 },
  '090111': { rule: 'WO', type: 'WO', rvc: null },
  '090240': { rule: 'CTH ou VCR 40%', type: 'CTH/VCR', rvc: 40 },
  '180690': { rule: 'CTH + VCR 35%', type: 'CTH + VCR', rvc: 35 },
  '310210': { rule: 'CTH', type: 'CTH', rvc: null },
  '252329': { rule: 'CTH', type: 'CTH', rvc: null },
  '392330': { rule: 'CTH + VCR 40%', type: 'CTH + VCR', rvc: 40 },
  '441113': { rule: 'CTH + VCR 35%', type: 'CTH + VCR', rvc: 35 },
  '940360': { rule: 'CTH + VCR 35%', type: 'CTH + VCR', rvc: 35 },
  '711311': { rule: 'CTH + VCR 35%', type: 'CTH + VCR', rvc: 35 },
  '760200': { rule: 'CTH + VCR 35%', type: 'CTH + VCR', rvc: 35 },
  '730890': { rule: 'CTH + VCR 35%', type: 'CTH + VCR', rvc: 35 },
  '850440': { rule: 'CTH + VCR 40%', type: 'CTH + VCR', rvc: 40 },
  '854140': { rule: 'CTH + VCR 40%', type: 'CTH + VCR', rvc: 40 },
  '870332': { rule: 'CTH + VCR 40%', type: 'CTH + VCR', rvc: 40 },
  '870421': { rule: 'CTH + VCR 40%', type: 'CTH + VCR', rvc: 40 },
  '300490': { rule: 'CTH + VCR 40%', type: 'CTH + VCR', rvc: 40 },
  '010121': { rule: 'Entièrement obtenus', type: 'WO', rvc: 100 },
  '180100': { rule: 'Transformation substantielle', type: 'CTH + VCR', rvc: 40 }
};
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
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedHsCode, setSelectedHsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('calculator');
  const [language, setLanguage] = useState('fr');
  const [calculationMode, setCalculationMode] = useState('NPF');

  const texts = {
    fr: {
      title: "ZLECAf Digital Hub",
      subtitle: "Plateforme Officielle d'Analyse Commerciale Africaine",
      calculatorTab: "Calculateur Tarifaire",
      statisticsTab: "Données & Statistiques", 
      rulesTab: "Règles d'Origine",
      profilesTab: "Profils Économiques",
      calculatorTitle: "Calculateur Tarifaire ZLECAf",
      calculatorDesc: "Calculs précis basés sur les données officielles des institutions internationales",
      originCountry: "Pays Exportateur",
      partnerCountry: "Pays Importateur", 
      hsCodeLabel: "Code SH6 (6 chiffres)",
      hsCodePlaceholder: "Ex: 010121, 180100, 090111",
      valueLabel: "Valeur de la Marchandise (USD)",
      valuePlaceholder: "Ex: 100000",
      calculateBtn: "Calculer les Tarifs",
      calculating: "Calcul en cours...",
      normalTariff: "Tarif NPF Standard",
      zlecafTariff: "Tarif ZLECAf Préférentiel",
      savings: "Économies Réalisées",
      rulesOrigin: "Règles d'Origine Applicables",
      partnerImports: "Données d'Importation",
      projections: "Projections Économiques",
      dataSources: "Sources Officielles",
      selectCountry: "Sélectionner un pays",
      selectHsCode: "Entrer le code SH6",
      searchCountry: "Rechercher un pays",
      statisticsTitle: "Statistiques Commerciales ZLECAf",
      statisticsDesc: "Données macroéconomiques et projections pour la Zone de Libre-Échange",
      rulesTitle: "Règles d'Origine par Secteur",
      rulesDesc: "Critères de qualification pour bénéficier des préférences tarifaires",
      profilesTitle: "Profils Économiques des Pays",
      profilesDesc: "Données économiques détaillées des 54 pays membres",
      officialSources: "Sources Officielles:",
      unionAfricaine: "Union Africaine",
      banqueMondiale: "Banque Mondiale",
      fmi: "FMI",
      bad: "BAD",
      unctad: "UNCTAD",
      oec: "OEC Atlas"
    },
    en: {
      title: "AfCFTA Digital Hub",
      subtitle: "Official African Trade Analysis Platform",
      calculatorTab: "Tariff Calculator",
      statisticsTab: "Data & Statistics",
      rulesTab: "Rules of Origin", 
      profilesTab: "Economic Profiles",
      calculatorTitle: "AfCFTA Tariff Calculator",
      calculatorDesc: "Precise calculations based on official data from international institutions",
      originCountry: "Exporting Country",
      partnerCountry: "Importing Country",
      hsCodeLabel: "HS6 Code (6 digits)",
      hsCodePlaceholder: "Ex: 010121, 180100, 090111",
      valueLabel: "Merchandise Value (USD)",
      valuePlaceholder: "Ex: 100000",
      calculateBtn: "Calculate Tariffs",
      calculating: "Calculating...",
      normalTariff: "Standard MFN Tariff",
      zlecafTariff: "AfCFTA Preferential Tariff",
      savings: "Savings Achieved",
      rulesOrigin: "Applicable Rules of Origin",
      partnerImports: "Import Data",
      projections: "Economic Projections",
      dataSources: "Official Sources",
      selectCountry: "Select a country",
      selectHsCode: "Enter HS6 code",
      searchCountry: "Search country",
      statisticsTitle: "AfCFTA Trade Statistics",
      statisticsDesc: "Macroeconomic data and projections for the Free Trade Area",
      rulesTitle: "Rules of Origin by Sector",
      rulesDesc: "Qualification criteria to benefit from tariff preferences",
      profilesTitle: "Country Economic Profiles",
      profilesDesc: "Detailed economic data for the 54 member countries",
      officialSources: "Official Sources:",
      unionAfricaine: "African Union",
      banqueMondiale: "World Bank",
      fmi: "IMF",
      bad: "AfDB",
      unctad: "UNCTAD",
      oec: "OEC Atlas"
    }
  };

  const t = texts[language];

  useEffect(() => {
    fetchCountries();
    fetchStatistics();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API}/countries`);
      setCountries(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des pays:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des pays",
        variant: "destructive",
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

  const fetchCountryProfile = async (countryCode) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/country-profile/${countryCode}`);
      setCountryProfile(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du profil pays:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil du pays",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRulesOfOrigin = async (hsCode) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/rules-of-origin/${hsCode}`);
      setRulesOfOrigin(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des règles d\'origine:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les règles d'origine",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    if (!originCountry || !destinationCountry || !hsCode || !value) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (hsCode.length !== 6) {
      toast({
        title: "Code SH invalide",
        description: "Le code SH doit contenir exactement 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API}/calculate-tariff`, {
        origin_country: originCountry,
        destination_country: destinationCountry,
        hs_code: hsCode,
        value: parseFloat(value)
      });
      setResult(response.data);
      toast({
        title: "Calcul terminé",
        description: "Les tarifs ont été calculés avec succès",
      });
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      toast({
        title: "Erreur de calcul",
        description: error.response?.data?.detail || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Professionnel */}
      <header className="zlecaf-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-logo">
              🌍
            </div>
            <div className="brand-text">
              <h1>{t.title}</h1>
              <p>{t.subtitle}</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="language-selector">
              <button 
                className={`language-btn ${language === 'fr' ? 'active' : ''}`}
                onClick={() => setLanguage('fr')}
              >
                🇫🇷 FR
              </button>
              <button 
                className={`language-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Principale */}
      <nav className="main-navigation">
        <div className="nav-content">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'calculator' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculator')}
            >
              <span className="nav-tab-icon">🧮</span>
              {t.calculatorTab}
            </button>
            <button
              className={`nav-tab ${activeTab === 'statistics' ? 'active' : ''}`}
              onClick={() => setActiveTab('statistics')}
            >
              <span className="nav-tab-icon">📊</span>
              {t.statisticsTab}
            </button>
            <button
              className={`nav-tab ${activeTab === 'rules' ? 'active' : ''}`}
              onClick={() => setActiveTab('rules')}
            >
              <span className="nav-tab-icon">📋</span>
              {t.rulesTab}
            </button>
            <button
              className={`nav-tab ${activeTab === 'profiles' ? 'active' : ''}`}
              onClick={() => setActiveTab('profiles')}
            >
              <span className="nav-tab-icon">🌍</span>
              {t.profilesTab}
            </button>
          </div>
        </div>
      </nav>

      {/* Conteneur Principal */}
      <main className="main-container">
        {/* Onglet Calculateur */}
        {activeTab === 'calculator' && (
          <div className="fade-in-up">
            <div className="professional-card">
              <div className="card-header-pro">
                <h2 className="card-title-pro">
                  🧮 {t.calculatorTitle}
                </h2>
                <p className="card-description-pro">
                  {t.calculatorDesc}
                </p>
              </div>
              <div className="card-content-pro">
                <div className="form-grid">
                  <div className="form-group-pro">
                    <label className="form-label-pro">
                      🏭 {t.originCountry}
                    </label>
                    <select
                      className="form-input-pro form-select-pro"
                      value={originCountry}
                      onChange={(e) => setOriginCountry(e.target.value)}
                    >
                      <option value="">{t.selectCountry}</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {countryFlags[country.code]} {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group-pro">
                    <label className="form-label-pro">
                      🏪 {t.partnerCountry}
                    </label>
                    <select
                      className="form-input-pro form-select-pro"
                      value={destinationCountry}
                      onChange={(e) => setDestinationCountry(e.target.value)}
                    >
                      <option value="">{t.selectCountry}</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {countryFlags[country.code]} {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group-pro">
                    <label className="form-label-pro">
                      📦 {t.hsCodeLabel}
                    </label>
                    <input
                      type="text"
                      className="form-input-pro"
                      placeholder={t.hsCodePlaceholder}
                      value={hsCode}
                      onChange={(e) => setHsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                    />
                  </div>

                  <div className="form-group-pro">
                    <label className="form-label-pro">
                      💰 {t.valueLabel}
                    </label>
                    <input
                      type="number"
                      className="form-input-pro"
                      placeholder={t.valuePlaceholder}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      min="0"
                      step="1000"
                    />
                  </div>
                </div>

                <div className="mb-xl">
                  <div className="professional-card">
                    <div className="card-content-pro">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Mode de Calcul</h3>
                          <div className="flex gap-4">
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="regime" 
                                value="NPF" 
                                checked={calculationMode === 'NPF'}
                                onChange={(e) => setCalculationMode(e.target.value)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                🏛️ NPF (taux nationaux hors préférence)
                              </span>
                            </label>
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="regime" 
                                value="ZLECAF" 
                                checked={calculationMode === 'ZLECAF'}
                                onChange={(e) => setCalculationMode(e.target.value)}
                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                🌍 ZLECAf (préférence, si éligible)
                              </span>
                            </label>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Le bénéfice ZLECAf suppose le respect de la règle d'origine et l'inclusion du produit dans le calendrier de démantèlement.
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <button
                            className="btn-primary-pro"
                            onClick={handleCalculate}
                            disabled={loading}
                          >
                            {loading && <div className="loading-spinner" />}
                            {loading ? t.calculating : t.calculateBtn}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Résultats avec graphiques donuts */}
                {result && (
                  <div className="fade-in-up">
                    {/* Graphiques Donuts */}
                    <div className="results-grid mb-xl">
                      <div className="metric-card">
                        <h4 className="font-semibold mb-md text-center">Régime NPF Standard</h4>
                        <div className="donut-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', position: 'relative'}}>
                          <svg width="180" height="180" viewBox="0 0 180 180">
                            <circle
                              cx="90"
                              cy="90"
                              r="70"
                              fill="none"
                              stroke="#E5E7EB"
                              strokeWidth="20"
                            />
                            <circle
                              cx="90"
                              cy="90"
                              r="70"
                              fill="none"
                              stroke="#EF4444"
                              strokeWidth="20"
                              strokeDasharray={`${(result.normal_tariff_amount / result.normal_total_cost) * 439.8} 439.8`}
                              strokeDashoffset="0"
                              transform="rotate(-90 90 90)"
                            />
                            <circle
                              cx="90"
                              cy="90"
                              r="70"
                              fill="none"
                              stroke="#F59E0B"
                              strokeWidth="20"
                              strokeDasharray={`${(result.normal_vat_amount / result.normal_total_cost) * 439.8} 439.8`}
                              strokeDashoffset={`-${(result.normal_tariff_amount / result.normal_total_cost) * 439.8}`}
                              transform="rotate(-90 90 90)"
                            />
                            <circle
                              cx="90"
                              cy="90"
                              r="70"
                              fill="none"
                              stroke="#6B7280"
                              strokeWidth="20"
                              strokeDasharray={`${((result.normal_other_taxes + result.normal_handling_fees) / result.normal_total_cost) * 439.8} 439.8`}
                              strokeDashoffset={`-${((result.normal_tariff_amount + result.normal_vat_amount) / result.normal_total_cost) * 439.8}`}
                              transform="rotate(-90 90 90)"
                            />
                            <text x="90" y="85" textAnchor="middle" className="text-lg font-bold fill-current text-gray-800">
                              {formatCurrency(result.normal_total_cost)}
                            </text>
                            <text x="90" y="100" textAnchor="middle" className="text-sm fill-current text-gray-600">
                              Total NPF
                            </text>
                          </svg>
                        </div>
                        <div className="space-y-2 mt-md">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                              <span className="text-sm font-medium">Droits:</span>
                            </div>
                            <div className="text-sm text-right">
                              <div className="font-semibold">{formatCurrency(result.normal_tariff_amount)}</div>
                              <div className="text-xs text-gray-600">({(result.normal_tariff_rate * 100).toFixed(1)}%)</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                              <span className="text-sm font-medium">TVA:</span>
                            </div>
                            <div className="text-sm text-right">
                              <div className="font-semibold">{formatCurrency(result.normal_vat_amount)}</div>
                              <div className="text-xs text-gray-600">({(result.normal_vat_rate * 100).toFixed(1)}%)</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                              <span className="text-sm font-medium">Autres:</span>
                            </div>
                            <div className="text-sm text-right">
                              <div className="font-semibold">{formatCurrency(result.normal_other_taxes + result.normal_handling_fees)}</div>
                              <div className="text-xs text-gray-600">
                                ({(((result.normal_other_taxes + result.normal_handling_fees) / result.value) * 100).toFixed(1)}%)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="metric-card">
                        <h4 className="font-semibold mb-md text-center">Régime ZLECAf</h4>
                        <div className="donut-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', position: 'relative'}}>
                          <svg width="180" height="180" viewBox="0 0 180 180">
                            <circle
                              cx="90"
                              cy="90"
                              r="70"
                              fill="none"
                              stroke="#E5E7EB"
                              strokeWidth="20"
                            />
                            <circle
                              cx="90"
                              cy="90"
                              r="70"
                              fill="none"
                              stroke="#10B981"
                              strokeWidth="20"
                              strokeDasharray={`${(result.zlecaf_tariff_amount / result.zlecaf_total_cost) * 439.8} 439.8`}
                              strokeDashoffset="0"
                              transform="rotate(-90 90 90)"
                            />
                            <circle
                              cx="90"
                              cy="90"
                              r="70"
                              fill="none"
                              stroke="#34D399"
                              strokeWidth="20"
                              strokeDasharray={`${(result.zlecaf_vat_amount / result.zlecaf_total_cost) * 439.8} 439.8`}
                              strokeDashoffset={`-${(result.zlecaf_tariff_amount / result.zlecaf_total_cost) * 439.8}`}
                              transform="rotate(-90 90 90)"
                            />
                            <circle
                              cx="90"
                              cy="90"
                              r="70"
                              fill="none"
                              stroke="#9CA3AF"
                              strokeWidth="20"
                              strokeDasharray={`${((result.zlecaf_other_taxes + result.zlecaf_handling_fees) / result.zlecaf_total_cost) * 439.8} 439.8`}
                              strokeDashoffset={`-${((result.zlecaf_tariff_amount + result.zlecaf_vat_amount) / result.zlecaf_total_cost) * 439.8}`}
                              transform="rotate(-90 90 90)"
                            />
                            <text x="90" y="85" textAnchor="middle" className="text-lg font-bold fill-current text-green-600">
                              {formatCurrency(result.zlecaf_total_cost)}
                            </text>
                            <text x="90" y="100" textAnchor="middle" className="text-sm fill-current text-gray-600">
                              Total ZLECAf
                            </text>
                          </svg>
                        </div>
                        <div className="space-y-2 mt-md">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                              <span className="text-sm font-medium">Droits:</span>
                            </div>
                            <div className="text-sm text-right">
                              <div className="font-semibold">{formatCurrency(result.zlecaf_tariff_amount)}</div>
                              <div className="text-xs text-gray-600">({(result.zlecaf_tariff_rate * 100).toFixed(1)}%)</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                              <span className="text-sm font-medium">TVA:</span>
                            </div>
                            <div className="text-sm text-right">
                              <div className="font-semibold">{formatCurrency(result.zlecaf_vat_amount)}</div>
                              <div className="text-xs text-gray-600">({(result.zlecaf_vat_rate * 100).toFixed(1)}%)</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                              <span className="text-sm font-medium">Autres:</span>
                            </div>
                            <div className="text-sm text-right">
                              <div className="font-semibold">{formatCurrency(result.zlecaf_other_taxes + result.zlecaf_handling_fees)}</div>
                              <div className="text-xs text-gray-600">
                                ({(((result.zlecaf_other_taxes + result.zlecaf_handling_fees) / result.value) * 100).toFixed(1)}%)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="metric-card" style={{gridColumn: 'span 2'}}>
                        <h4 className="font-semibold mb-md text-center">Économies Détaillées</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                          <div className="text-center">
                            <div className="metric-value text-green-600">
                              {formatCurrency(result.tariff_savings || 0)}
                            </div>
                            <div className="metric-label">Économie Droits</div>
                          </div>
                          <div className="text-center">
                            <div className="metric-value text-green-600">
                              {formatCurrency(result.vat_savings || 0)}
                            </div>
                            <div className="metric-label">Économie TVA</div>
                          </div>
                          <div className="text-center">
                            <div className="metric-value text-green-600">
                              {formatCurrency(result.other_savings || 0)}
                            </div>
                            <div className="metric-label">Autres Économies</div>
                          </div>
                        </div>
                        <div className="border-t pt-lg mt-lg">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-sm">
                              {formatCurrency(result.savings)}
                            </div>
                            <div className="text-lg font-semibold text-gray-700">
                              Économie Totale ({result.savings_percentage?.toFixed(1)}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tableau détaillé des coûts */}
                    <div className="professional-card">
                      <div className="card-content-pro">
                        <h3 className="card-title-pro mb-lg">
                          💰 Détail des Coûts par Composant
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="table-pro">
                            <thead>
                              <tr>
                                <th>Composant</th>
                                <th>Régime NPF</th>
                                <th>Régime ZLECAf</th>
                                <th>Économie</th>
                                <th>% Économie</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="font-medium">💼 Valeur Marchandise</td>
                                <td className="font-semibold">{formatCurrency(result.value)}</td>
                                <td className="font-semibold">{formatCurrency(result.value)}</td>
                                <td className="text-gray-500">-</td>
                                <td className="text-gray-500">-</td>
                              </tr>
                              <tr>
                                <td className="font-medium">🏛️ Droits de Douane</td>
                                <td>
                                  <div className="font-semibold">{formatCurrency(result.normal_tariff_amount)}</div>
                                  <div className="text-sm text-gray-600">Taux: {(result.normal_tariff_rate * 100).toFixed(1)}%</div>
                                </td>
                                <td>
                                  <div className="font-semibold">{formatCurrency(result.zlecaf_tariff_amount)}</div>
                                  <div className="text-sm text-gray-600">Taux: {(result.zlecaf_tariff_rate * 100).toFixed(1)}%</div>
                                </td>
                                <td className="text-green-600 font-semibold">{formatCurrency(result.tariff_savings || 0)}</td>
                                <td className="text-green-600 font-semibold">
                                  {result.normal_tariff_amount > 0 ? (((result.tariff_savings || 0) / result.normal_tariff_amount) * 100).toFixed(1) : '0'}%
                                </td>
                              </tr>
                              <tr>
                                <td className="font-medium">🧾 TVA</td>
                                <td>
                                  <div className="font-semibold">{formatCurrency(result.normal_vat_amount)}</div>
                                  <div className="text-sm text-gray-600">
                                    Taux: {(result.normal_vat_rate * 100).toFixed(1)}%<br/>
                                    Base: {formatCurrency(result.value + result.normal_tariff_amount)}
                                  </div>
                                </td>
                                <td>
                                  <div className="font-semibold">{formatCurrency(result.zlecaf_vat_amount)}</div>
                                  <div className="text-sm text-gray-600">
                                    Taux: {(result.zlecaf_vat_rate * 100).toFixed(1)}%<br/>
                                    Base: {formatCurrency(result.value + result.zlecaf_tariff_amount)}
                                  </div>
                                </td>
                                <td className="text-green-600 font-semibold">{formatCurrency(result.vat_savings || 0)}</td>
                                <td className="text-green-600 font-semibold">
                                  {result.normal_vat_amount > 0 ? (((result.vat_savings || 0) / result.normal_vat_amount) * 100).toFixed(1) : '0'}%
                                </td>
                              </tr>
                              <tr>
                                <td className="font-medium">📋 Autres Taxes</td>
                                <td>
                                  <div className="font-semibold">{formatCurrency(result.normal_other_taxes)}</div>
                                  <div className="text-sm text-gray-600">
                                    Taux: {((result.normal_other_taxes / result.value) * 100).toFixed(2)}%
                                  </div>
                                </td>
                                <td>
                                  <div className="font-semibold">{formatCurrency(result.zlecaf_other_taxes)}</div>
                                  <div className="text-sm text-gray-600">
                                    Taux: {((result.zlecaf_other_taxes / result.value) * 100).toFixed(2)}%
                                  </div>
                                </td>
                                <td className="text-green-600 font-semibold">{formatCurrency((result.normal_other_taxes || 0) - (result.zlecaf_other_taxes || 0))}</td>
                                <td className="text-green-600 font-semibold">
                                  {result.normal_other_taxes > 0 ? ((((result.normal_other_taxes || 0) - (result.zlecaf_other_taxes || 0)) / result.normal_other_taxes) * 100).toFixed(1) : '0'}%
                                </td>
                              </tr>
                              <tr>
                                <td className="font-medium">🔧 Frais Manutention</td>
                                <td>
                                  <div className="font-semibold">{formatCurrency(result.normal_handling_fees)}</div>
                                  <div className="text-sm text-gray-600">
                                    Taux: {((result.normal_handling_fees / result.value) * 100).toFixed(2)}%
                                  </div>
                                </td>
                                <td>
                                  <div className="font-semibold">{formatCurrency(result.zlecaf_handling_fees)}</div>
                                  <div className="text-sm text-gray-600">
                                    Taux: {((result.zlecaf_handling_fees / result.value) * 100).toFixed(2)}%
                                  </div>
                                </td>
                                <td className="text-green-600 font-semibold">{formatCurrency((result.normal_handling_fees || 0) - (result.zlecaf_handling_fees || 0))}</td>
                                <td className="text-green-600 font-semibold">
                                  {result.normal_handling_fees > 0 ? ((((result.normal_handling_fees || 0) - (result.zlecaf_handling_fees || 0)) / result.normal_handling_fees) * 100).toFixed(1) : '0'}%
                                </td>
                              </tr>
                              <tr className="bg-gradient-to-r from-gray-100 to-gray-50 font-bold border-t-2 border-gray-300">
                                <td className="text-lg">💰 COÛT TOTAL</td>
                                <td className="text-red-600 text-lg">
                                  <div>{formatCurrency(result.normal_total_cost)}</div>
                                  <div className="text-sm font-normal text-gray-600">
                                    Taux effectif: {((result.normal_total_cost - result.value) / result.value * 100).toFixed(1)}%
                                  </div>
                                </td>
                                <td className="text-green-600 text-lg">
                                  <div>{formatCurrency(result.zlecaf_total_cost)}</div>
                                  <div className="text-sm font-normal text-gray-600">
                                    Taux effectif: {((result.zlecaf_total_cost - result.value) / result.value * 100).toFixed(1)}%
                                  </div>
                                </td>
                                <td className="text-green-600 text-xl font-bold">{formatCurrency(result.savings)}</td>
                                <td className="text-green-600 text-xl font-bold">{result.savings_percentage?.toFixed(1)}%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Règles d'origine enrichies */}
                {result && result.rules_of_origin && (
                  <div className="professional-card mt-xl">
                    <div className="card-content-pro">
                      <h3 className="card-title-pro mb-lg">
                        📋 {t.rulesOrigin} - Code {result.hs_code}
                      </h3>
                      
                      {/* Informations sur le produit */}
                      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <div className="text-blue-600 text-lg">📦</div>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-1">
                              Produit: {REFERENCE_PRODUCTS[result.hs_code] || `Code HS ${result.hs_code}`}
                            </h4>
                            <p className="text-gray-700 text-sm">
                              Analyse des règles d'origine spécifiques pour l'éligibilité ZLECAf
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="badge-pro badge-info mb-3">
                            Règle Applicable
                          </div>
                          <p className="text-gray-700 mb-2 font-medium">{result.rules_of_origin.rule}</p>
                          <p className="text-xs text-gray-600">
                            Type: {REFERENCE_PSR[result.hs_code]?.type || 'Standard'}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="badge-pro badge-success mb-3">
                            Exigence VCR
                          </div>
                          <p className="text-gray-700 mb-2 font-medium">
                            {REFERENCE_PSR[result.hs_code]?.rvc 
                              ? `${REFERENCE_PSR[result.hs_code].rvc}% minimum`
                              : result.rules_of_origin.requirement
                            }
                          </p>
                          <p className="text-xs text-gray-600">
                            Valeur ajoutée régionale minimum
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="badge-pro badge-warning mb-3">
                            Statut Éligibilité
                          </div>
                          <p className="text-gray-700 mb-2 font-medium">
                            {calculationMode === 'ZLECAF' ? '✅ Éligible' : '⚠️ Non testé'}
                          </p>
                          <p className="text-xs text-gray-600">
                            Basé sur le mode de calcul sélectionné
                          </p>
                        </div>
                      </div>

                      {/* Documentation requise */}
                      {REFERENCE_PSR[result.hs_code] && (
                        <div className="border-t pt-6 mt-6">
                          <h4 className="font-semibold mb-4 text-gray-800">📋 Documentation Requise</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="space-y-2 text-sm text-gray-700">
                              <li className="flex items-center gap-2">
                                <span className="text-green-600">•</span>
                                Certificat d'origine EUR.1 ou déclaration sur facture
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-green-600">•</span>
                                Factures commerciales détaillées
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-green-600">•</span>
                                Justificatifs de la valeur ajoutée régionale
                              </li>
                            </ul>
                            <ul className="space-y-2 text-sm text-gray-700">
                              <li className="flex items-center gap-2">
                                <span className="text-green-600">•</span>
                                Documents de transport (connaissement, CMR)
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-green-600">•</span>
                                Certificats de conformité technique
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-green-600">•</span>
                                Déclarations du fournisseur pour inputs
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Statistiques */}
        {activeTab === 'statistics' && (
          <div className="fade-in-up">
            <div className="professional-card">
              <div className="card-header-pro">
                <h2 className="card-title-pro">
                  📊 {t.statisticsTitle}
                </h2>
                <p className="card-description-pro">
                  {t.statisticsDesc}
                </p>
              </div>
              <div className="card-content-pro">
                {statistics && (
                  <>
                    <div className="results-grid mb-xl">
                      <div className="metric-card">
                        <div className="metric-value">
                          {statistics.overview?.african_countries_members || 54}
                        </div>
                        <div className="metric-label">Pays Membres</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">
                          {formatNumber(statistics.overview?.combined_population || 0)}
                        </div>
                        <div className="metric-label">Population Totale</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">
                          {formatCurrency(statistics.overview?.estimated_combined_gdp || 0)}
                        </div>
                        <div className="metric-label">PIB Combiné</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">
                          {formatCurrency(statistics.overview?.total_savings || 0)}
                        </div>
                        <div className="metric-label">Économies Calculées</div>
                      </div>
                    </div>

                    {/* Projections */}
                    {statistics.projections && (
                      <div className="professional-card">
                        <div className="card-content-pro">
                          <h3 className="card-title-pro mb-lg">
                            🚀 {t.projections}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                            <div>
                              <h4 className="font-semibold text-lg mb-md">Projections 2025</h4>
                              <ul className="space-y-2">
                                <li>📈 Augmentation commerce: {statistics.projections['2025']?.trade_volume_increase}</li>
                                <li>📋 Éliminations tarifaires: {statistics.projections['2025']?.tariff_eliminations}</li>
                                <li>🛣️ Nouveaux corridors: {statistics.projections['2025']?.new_trade_corridors}</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg mb-md">Projections 2030</h4>
                              <ul className="space-y-2">
                                <li>📊 Augmentation commerce: {statistics.projections['2030']?.trade_volume_increase}</li>
                                <li>💰 Augmentation PIB: {statistics.projections['2030']?.gdp_increase}</li>
                                <li>🏭 Boost industrialisation: {statistics.projections['2030']?.industrialization_boost}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Règles d'Origine */}
        {activeTab === 'rules' && (
          <div className="fade-in-up">
            <div className="professional-card">
              <div className="card-header-pro">
                <h2 className="card-title-pro">
                  📋 {t.rulesTitle}
                </h2>
                <p className="card-description-pro">
                  {t.rulesDesc}
                </p>
              </div>
              <div className="card-content-pro">
                <div className="form-group-pro mb-xl">
                  <label className="form-label-pro">
                    🔍 Rechercher par Code SH6
                  </label>
                  <div className="flex gap-md">
                    <input
                      type="text"
                      className="form-input-pro flex-1"
                      placeholder={t.hsCodePlaceholder}
                      value={selectedHsCode}
                      onChange={(e) => setSelectedHsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                    />
                    <button
                      className="btn-primary-pro"
                      onClick={() => selectedHsCode && fetchRulesOfOrigin(selectedHsCode)}
                      disabled={loading || selectedHsCode.length !== 6}
                    >
                      {loading && <div className="loading-spinner" />}
                      Rechercher
                    </button>
                  </div>
                </div>

                {rulesOfOrigin && (
                  <div className="professional-card fade-in-up">
                    <div className="card-content-pro">
                      <div className="flex items-center gap-md mb-lg">
                        <div className="badge-pro badge-info">
                          Code SH: {rulesOfOrigin.hs_code}
                        </div>
                        <div className="badge-pro badge-success">
                          Secteur: {rulesOfOrigin.sector_code}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
                        <div>
                          <h4 className="font-semibold mb-sm">Type de Règle</h4>
                          <p className="text-gray-700">{rulesOfOrigin.rules?.rule}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-sm">Exigence</h4>
                          <p className="text-gray-700">{rulesOfOrigin.rules?.requirement}</p>
                        </div>
                      </div>

                      {rulesOfOrigin.explanation && (
                        <div className="border-t pt-lg">
                          <h4 className="font-semibold mb-sm">Documentation Requise</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {rulesOfOrigin.explanation.documentation_required?.map((doc, index) => (
                              <li key={index}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Profils Pays */}
        {activeTab === 'profiles' && (
          <div className="fade-in-up">
            <div className="professional-card">
              <div className="card-header-pro">
                <h2 className="card-title-pro">
                  🌍 {t.profilesTitle}
                </h2>
                <p className="card-description-pro">
                  {t.profilesDesc}
                </p>
              </div>
              <div className="card-content-pro">
                <div className="form-group-pro mb-xl">
                  <label className="form-label-pro">
                    🔍 Sélectionner un Pays
                  </label>
                  <div className="flex gap-md">
                    <select
                      className="form-input-pro form-select-pro flex-1"
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                    >
                      <option value="">{t.selectCountry}</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {countryFlags[country.code]} {country.name}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn-primary-pro"
                      onClick={() => selectedCountryCode && fetchCountryProfile(selectedCountryCode)}
                      disabled={loading || !selectedCountryCode}
                    >
                      {loading && <div className="loading-spinner" />}
                      Charger Profil
                    </button>
                  </div>
                </div>

                {countryProfile && (
                  <div className="professional-card fade-in-up">
                    <div className="card-content-pro">
                      <div className="flex items-center gap-md mb-lg">
                        <div className="text-4xl">
                          {countryFlags[countryProfile.country_code]}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{countryProfile.country_name}</h3>
                          <p className="text-gray-600">{countryProfile.region}</p>
                        </div>
                      </div>

                      <div className="results-grid mb-lg">
                        <div className="metric-card">
                          <div className="metric-value">
                            {formatNumber(countryProfile.population || 0)}
                          </div>
                          <div className="metric-label">Population</div>
                        </div>
                        {countryProfile.gdp_usd && (
                          <div className="metric-card">
                            <div className="metric-value">
                              {formatCurrency(countryProfile.gdp_usd)}
                            </div>
                            <div className="metric-label">PIB (USD)</div>
                          </div>
                        )}
                        {countryProfile.gdp_per_capita && (
                          <div className="metric-card">
                            <div className="metric-value">
                              {formatCurrency(countryProfile.gdp_per_capita)}
                            </div>
                            <div className="metric-label">PIB/Habitant</div>
                          </div>
                        )}
                        {countryProfile.projections?.africa_rank && (
                          <div className="metric-card">
                            <div className="metric-value">
                              #{countryProfile.projections.africa_rank}
                            </div>
                            <div className="metric-label">Rang Afrique</div>
                          </div>
                        )}
                      </div>

                      {countryProfile.projections?.key_sectors && (
                        <div className="border-t pt-lg">
                          <h4 className="font-semibold mb-sm">Secteurs Clés</h4>
                          <div className="space-y-2">
                            {countryProfile.projections.key_sectors.slice(0, 3).map((sector, index) => (
                              <div key={index} className="badge-pro badge-info">
                                {sector}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Professionnel */}
      <footer className="zlecaf-footer">
        <div className="footer-content">
          <div className="footer-links">
            <span className="footer-link">{t.officialSources}</span>
            <span className="footer-link">{t.unionAfricaine}</span>
            <span className="footer-link">{t.banqueMondiale}</span>
            <span className="footer-link">{t.fmi}</span>
            <span className="footer-link">{t.bad}</span>
            <span className="footer-link">{t.unctad}</span>
            <span className="footer-link">{t.oec}</span>
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} ZLECAf Digital Hub - Plateforme Officielle d'Analyse Commerciale Africaine
          </div>
        </div>
      </footer>

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