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

// Données commerciales mockées (en millions USD)
const TRADE_STATISTICS = {
  'DZ': {
    name: 'Algérie',
    imports: { '2023': 48500, '2024': 52300 },
    exports: { '2023': 38200, '2024': 41800 },
    top_imports: [
      { product: 'Machines et équipements', value: 8500, code: '84' },
      { product: 'Véhicules automobiles', value: 6200, code: '87' },
      { product: 'Céréales', value: 4800, code: '10' },
      { product: 'Produits pharmaceutiques', value: 3500, code: '30' },
      { product: 'Fer et acier', value: 2900, code: '72' },
      { product: 'Matières plastiques', value: 2400, code: '39' },
      { product: 'Textiles', value: 2100, code: '52-63' },
      { product: 'Produits chimiques', value: 1800, code: '28-38' },
      { product: 'Équipements électriques', value: 1600, code: '85' },
      { product: 'Produits alimentaires', value: 1400, code: '16-22' }
    ],
    top_exports: [
      { product: 'Hydrocarbures', value: 32500, code: '27' },
      { product: 'Produits minéraux', value: 2100, code: '25-26' },
      { product: 'Produits chimiques', value: 1800, code: '28-38' },
      { product: 'Produits agricoles', value: 1200, code: '01-24' },
      { product: 'Fer et acier', value: 900, code: '72' },
      { product: 'Textiles', value: 600, code: '52-63' },
      { product: 'Cuir et maroquinerie', value: 400, code: '41-43' },
      { product: 'Produits alimentaires', value: 350, code: '16-22' },
      { product: 'Machines', value: 300, code: '84' },
      { product: 'Autres manufactures', value: 250, code: 'Divers' }
    ]
  },
  'MA': {
    name: 'Maroc',
    imports: { '2023': 68400, '2024': 72100 },
    exports: { '2023': 58900, '2024': 63200 },
    top_imports: [
      { product: 'Hydrocarbures', value: 12800, code: '27' },
      { product: 'Machines et équipements', value: 9200, code: '84' },
      { product: 'Véhicules automobiles', value: 7500, code: '87' },
      { product: 'Équipements électriques', value: 5800, code: '85' },
      { product: 'Produits chimiques', value: 4900, code: '28-38' },
      { product: 'Céréales', value: 3600, code: '10' },
      { product: 'Fer et acier', value: 3200, code: '72' },
      { product: 'Matières plastiques', value: 2800, code: '39' },
      { product: 'Textiles', value: 2400, code: '52-63' },
      { product: 'Produits pharmaceutiques', value: 2100, code: '30' }
    ],
    top_exports: [
      { product: 'Automobiles', value: 14200, code: '87' },
      { product: 'Textiles et habillement', value: 8900, code: '52-63' },
      { product: 'Phosphates et dérivés', value: 7800, code: '25/31' },
      { product: 'Produits agricoles', value: 6500, code: '01-24' },
      { product: 'Équipements électriques', value: 5200, code: '85' },
      { product: 'Produits chimiques', value: 4100, code: '28-38' },
      { product: 'Aéronautique', value: 3800, code: '88' },
      { product: 'Cuir et maroquinerie', value: 2900, code: '41-43' },
      { product: 'Produits alimentaires', value: 2600, code: '16-22' },
      { product: 'Machines', value: 2400, code: '84' }
    ]
  },
  'EG': {
    name: 'Égypte',
    imports: { '2023': 89200, '2024': 95600 },
    exports: { '2023': 56800, '2024': 61200 },
    top_imports: [
      { product: 'Hydrocarbures', value: 18500, code: '27' },
      { product: 'Céréales', value: 12300, code: '10' },
      { product: 'Machines et équipements', value: 11800, code: '84' },
      { product: 'Fer et acier', value: 8900, code: '72' },
      { product: 'Véhicules automobiles', value: 7200, code: '87' },
      { product: 'Équipements électriques', value: 6800, code: '85' },
      { product: 'Produits chimiques', value: 5400, code: '28-38' },
      { product: 'Matières plastiques', value: 4200, code: '39' },
      { product: 'Produits pharmaceutiques', value: 3800, code: '30' },
      { product: 'Textiles', value: 3200, code: '52-63' }
    ],
    top_exports: [
      { product: 'Hydrocarbures', value: 18900, code: '27' },
      { product: 'Produits chimiques', value: 8200, code: '28-38' },
      { product: 'Textiles et habillement', value: 6800, code: '52-63' },
      { product: 'Produits agricoles', value: 5900, code: '01-24' },
      { product: 'Fer et acier', value: 4200, code: '72' },
      { product: 'Produits alimentaires', value: 3800, code: '16-22' },
      { product: 'Machines', value: 2900, code: '84' },
      { product: 'Matières plastiques', value: 2400, code: '39' },
      { product: 'Équipements électriques', value: 2200, code: '85' },
      { product: 'Produits minéraux', value: 1900, code: '25-26' }
    ]
  },
  // Ajoutons d'autres pays...
  'ZA': {
    name: 'Afrique du Sud',
    imports: { '2023': 98500, '2024': 104200 },
    exports: { '2023': 124800, '2024': 132600 },
    top_imports: [
      { product: 'Hydrocarbures', value: 22400, code: '27' },
      { product: 'Machines et équipements', value: 15800, code: '84' },
      { product: 'Véhicules automobiles', value: 12600, code: '87' },
      { product: 'Équipements électriques', value: 9200, code: '85' },
      { product: 'Produits chimiques', value: 7800, code: '28-38' },
      { product: 'Textiles', value: 5400, code: '52-63' },
      { product: 'Produits pharmaceutiques', value: 4900, code: '30' },
      { product: 'Matières plastiques', value: 4200, code: '39' },
      { product: 'Fer et acier', value: 3800, code: '72' },
      { product: 'Produits alimentaires', value: 3500, code: '16-22' }
    ],
    top_exports: [
      { product: 'Métaux précieux (or, platine)', value: 42800, code: '71' },
      { product: 'Minerais de fer', value: 18500, code: '26' },
      { product: 'Charbon', value: 15200, code: '27' },
      { product: 'Automobiles', value: 12900, code: '87' },
      { product: 'Machines et équipements', value: 9800, code: '84' },
      { product: 'Produits chimiques', value: 8400, code: '28-38' },
      { product: 'Produits agricoles', value: 7200, code: '01-24' },
      { product: 'Fer et acier', value: 6800, code: '72' },
      { product: 'Équipements électriques', value: 5600, code: '85' },
      { product: 'Textiles', value: 4200, code: '52-63' }
    ]
  },
  'NG': {
    name: 'Nigeria',
    imports: { '2023': 56800, '2024': 62400 },
    exports: { '2023': 67200, '2024': 73800 },
    top_imports: [
      { product: 'Machines et équipements', value: 12400, code: '84' },
      { product: 'Véhicules automobiles', value: 9800, code: '87' },
      { product: 'Céréales', value: 7600, code: '10' },
      { product: 'Équipements électriques', value: 6200, code: '85' },
      { product: 'Produits pharmaceutiques', value: 4900, code: '30' },
      { product: 'Fer et acier', value: 4200, code: '72' },
      { product: 'Produits chimiques', value: 3800, code: '28-38' },
      { product: 'Textiles', value: 3200, code: '52-63' },
      { product: 'Matières plastiques', value: 2800, code: '39' },
      { product: 'Produits alimentaires', value: 2400, code: '16-22' }
    ],
    top_exports: [
      { product: 'Pétrole brut', value: 58900, code: '27' },
      { product: 'Gaz naturel', value: 8200, code: '27' },
      { product: 'Produits agricoles', value: 2800, code: '01-24' },
      { product: 'Produits chimiques', value: 1400, code: '28-38' },
      { product: 'Cuir et maroquinerie', value: 900, code: '41-43' },
      { product: 'Textiles', value: 600, code: '52-63' },
      { product: 'Produits alimentaires', value: 500, code: '16-22' },
      { product: 'Machines', value: 400, code: '84' },
      { product: 'Matières plastiques', value: 300, code: '39' },
      { product: 'Autres manufactures', value: 200, code: 'Divers' }
    ]
  },
  'GH': {
    name: 'Ghana',
    imports: { '2023': 18400, '2024': 20100 },
    exports: { '2023': 15800, '2024': 17200 },
    top_imports: [
      { product: 'Hydrocarbures', value: 4200, code: '27' },
      { product: 'Machines et équipements', value: 3100, code: '84' },
      { product: 'Véhicules automobiles', value: 2400, code: '87' },
      { product: 'Céréales', value: 1900, code: '10' },
      { product: 'Fer et acier', value: 1500, code: '72' },
      { product: 'Équipements électriques', value: 1200, code: '85' },
      { product: 'Produits pharmaceutiques', value: 1000, code: '30' },
      { product: 'Textiles', value: 800, code: '52-63' },
      { product: 'Produits chimiques', value: 600, code: '28-38' },
      { product: 'Matières plastiques', value: 500, code: '39' }
    ],
    top_exports: [
      { product: 'Or', value: 8900, code: '71' },
      { product: 'Cacao', value: 2800, code: '18' },
      { product: 'Pétrole brut', value: 1900, code: '27' },
      { product: 'Produits agricoles', value: 900, code: '01-24' },
      { product: 'Bois et dérivés', value: 600, code: '44' },
      { product: 'Produits alimentaires', value: 400, code: '16-22' },
      { product: 'Textiles', value: 300, code: '52-63' },
      { product: 'Produits chimiques', value: 200, code: '28-38' },
      { product: 'Machines', value: 150, code: '84' },
      { product: 'Autres manufactures', value: 100, code: 'Divers' }
    ]
  },
  'KE': {
    name: 'Kenya',
    imports: { '2023': 18400, '2024': 20100 },
    exports: { '2023': 8900, '2024': 10100 },
    top_imports: [
      { product: 'Hydrocarbures', value: 5400, code: '27' },
      { product: 'Machines et équipements', value: 3800, code: '84' },
      { product: 'Véhicules automobiles', value: 2900, code: '87' },
      { product: 'Fer et acier', value: 2200, code: '72' },
      { product: 'Équipements électriques', value: 1800, code: '85' },
      { product: 'Produits pharmaceutiques', value: 1400, code: '30' },
      { product: 'Produits chimiques', value: 1200, code: '28-38' },
      { product: 'Céréales', value: 1000, code: '10' },
      { product: 'Textiles', value: 900, code: '52-63' },
      { product: 'Matières plastiques', value: 700, code: '39' }
    ],
    top_exports: [
      { product: 'Thé', value: 2400, code: '09' },
      { product: 'Café', value: 1800, code: '09' },
      { product: 'Fleurs coupées', value: 1200, code: '06' },
      { product: 'Légumes', value: 900, code: '07' },
      { product: 'Textiles', value: 800, code: '52-63' },
      { product: 'Produits alimentaires', value: 600, code: '16-22' },
      { product: 'Cuir et maroquinerie', value: 500, code: '41-43' },
      { product: 'Produits chimiques', value: 400, code: '28-38' },
      { product: 'Machines', value: 300, code: '84' },
      { product: 'Autres produits', value: 200, code: 'Divers' }
    ]
  }
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

// Couleurs nationales des pays africains (basées sur leurs drapeaux)
const COUNTRY_COLORS = {
  'DZ': { primary: '#007A3D', secondary: '#CE1126' }, // Algérie : Vert et Rouge
  'MA': { primary: '#C1272D', secondary: '#006233' }, // Maroc : Rouge et Vert
  'EG': { primary: '#CE1126', secondary: '#000000' }, // Égypte : Rouge et Noir
  'ZA': { primary: '#007A4D', secondary: '#002395' }, // Afrique du Sud : Vert et Bleu
  'NG': { primary: '#008751', secondary: '#FFFFFF' }, // Nigeria : Vert et Blanc
  'GH': { primary: '#CE1126', secondary: '#FCD116' }, // Ghana : Rouge et Or
  'KE': { primary: '#BB0000', secondary: '#000000' }  // Kenya : Rouge et Noir
};

// Fonction pour formater en millions USD
const formatMillionsUSD = (value) => {
  if (!value) return '0 M$';
  return `${(value / 1000).toFixed(1)} Mds$`;
};

const formatUSDMillion = (value) => {
  if (!value) return '0 M$';
  return `${value.toLocaleString('fr-FR')} M$`;
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
  const [selectedCountries, setSelectedCountries] = useState({origin: '', destination: ''});

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
      // Sauvegarder les pays sélectionnés pour les statistiques
      setSelectedCountries({origin: originCountry, destination: destinationCountry});
      
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
                    <div class="card-content-pro">
                      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <div className="text-blue-600 text-lg">ℹ️</div>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-1">
                              Conditions d'Éligibilité ZLECAf
                            </h4>
                            <p className="text-gray-700 text-sm">
                              Le bénéfice ZLECAf suppose le respect de la règle d'origine et l'inclusion du produit dans le calendrier de démantèlement.
                            </p>
                          </div>
                        </div>
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
                            {calculationMode === 'ZLECAF' ? '✅ Éligible' : '⚠️ Calculé selon les conditions ZLECAf'}
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
            {selectedCountries.origin && selectedCountries.destination ? (
              <div className="space-y-xl">
                {/* Header avec pays sélectionnés */}
                <div className="professional-card">
                  <div className="card-header-pro">
                    <h2 className="card-title-pro">
                      📊 Données Commerciales Bilatérales
                    </h2>
                    <p className="card-description-pro">
                      Statistiques détaillées : {countryFlags[selectedCountries.origin]} {TRADE_STATISTICS[selectedCountries.origin]?.name} ↔ {countryFlags[selectedCountries.destination]} {TRADE_STATISTICS[selectedCountries.destination]?.name}
                    </p>
                  </div>
                </div>

                {/* Résumé des échanges */}
                <div className="results-grid">
                  <div className="metric-card">
                    <div className="metric-value">
                      {formatUSDMillion(TRADE_STATISTICS[selectedCountries.origin]?.imports['2024'] || 0)}
                    </div>
                    <div className="metric-label">{TRADE_STATISTICS[selectedCountries.origin]?.name} - Importations 2024</div>
                    <div className="metric-change">
                      +{(((TRADE_STATISTICS[selectedCountries.origin]?.imports['2024'] || 0) - (TRADE_STATISTICS[selectedCountries.origin]?.imports['2023'] || 0)) / (TRADE_STATISTICS[selectedCountries.origin]?.imports['2023'] || 1) * 100).toFixed(1)}% vs 2023
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-value">
                      {formatUSDMillion(TRADE_STATISTICS[selectedCountries.origin]?.exports['2024'] || 0)}
                    </div>
                    <div className="metric-label">{TRADE_STATISTICS[selectedCountries.origin]?.name} - Exportations 2024</div>
                    <div className="metric-change">
                      +{(((TRADE_STATISTICS[selectedCountries.origin]?.exports['2024'] || 0) - (TRADE_STATISTICS[selectedCountries.origin]?.exports['2023'] || 0)) / (TRADE_STATISTICS[selectedCountries.origin]?.exports['2023'] || 1) * 100).toFixed(1)}% vs 2023
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-value">
                      {formatUSDMillion(TRADE_STATISTICS[selectedCountries.destination]?.imports['2024'] || 0)}
                    </div>
                    <div className="metric-label">{TRADE_STATISTICS[selectedCountries.destination]?.name} - Importations 2024</div>
                    <div className="metric-change">
                      +{(((TRADE_STATISTICS[selectedCountries.destination]?.imports['2024'] || 0) - (TRADE_STATISTICS[selectedCountries.destination]?.imports['2023'] || 0)) / (TRADE_STATISTICS[selectedCountries.destination]?.imports['2023'] || 1) * 100).toFixed(1)}% vs 2023
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-value">
                      {formatUSDMillion(TRADE_STATISTICS[selectedCountries.destination]?.exports['2024'] || 0)}
                    </div>
                    <div className="metric-label">{TRADE_STATISTICS[selectedCountries.destination]?.name} - Exportations 2024</div>
                    <div className="metric-change">
                      +{(((TRADE_STATISTICS[selectedCountries.destination]?.exports['2024'] || 0) - (TRADE_STATISTICS[selectedCountries.destination]?.exports['2023'] || 0)) / (TRADE_STATISTICS[selectedCountries.destination]?.exports['2023'] || 1) * 100).toFixed(1)}% vs 2023
                    </div>
                  </div>
                </div>

                {/* Graphique comparatif */}
                <div className="professional-card mb-xl">
                  <div className="card-content-pro">
                    <h3 className="card-title-pro mb-lg">
                      📊 Comparaison Commerciale 2023-2024 (en millions USD)
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                      {/* Graphique Importations */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-800 mb-4 text-center">Importations</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium flex items-center gap-2">
                                {countryFlags[selectedCountries.origin]} {TRADE_STATISTICS[selectedCountries.origin]?.name}
                              </span>
                              <span className="text-lg font-bold" style={{color: COUNTRY_COLORS[selectedCountries.origin]?.primary}}>
                                {formatUSDMillion(TRADE_STATISTICS[selectedCountries.origin]?.imports['2024'] || 0)}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <div 
                                className="h-8 rounded-md flex items-center justify-center text-white text-sm font-semibold"
                                style={{
                                  backgroundColor: COUNTRY_COLORS[selectedCountries.origin]?.primary,
                                  width: `${(TRADE_STATISTICS[selectedCountries.origin]?.imports['2024'] || 0) / Math.max(TRADE_STATISTICS[selectedCountries.origin]?.imports['2024'] || 0, TRADE_STATISTICS[selectedCountries.destination]?.imports['2024'] || 0) * 100}%`,
                                  minWidth: '60px'
                                }}
                              >
                                2024
                              </div>
                            </div>
                            <div className="flex gap-2 mt-1">
                              <div 
                                className="h-6 rounded-md flex items-center justify-center text-white text-xs"
                                style={{
                                  backgroundColor: COUNTRY_COLORS[selectedCountries.origin]?.secondary,
                                  width: `${(TRADE_STATISTICS[selectedCountries.origin]?.imports['2023'] || 0) / Math.max(TRADE_STATISTICS[selectedCountries.origin]?.imports['2024'] || 0, TRADE_STATISTICS[selectedCountries.destination]?.imports['2024'] || 0) * 100}%`,
                                  minWidth: '40px',
                                  opacity: 0.7
                                }}
                              >
                                2023
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium flex items-center gap-2">
                                {countryFlags[selectedCountries.destination]} {TRADE_STATISTICS[selectedCountries.destination]?.name}
                              </span>
                              <span className="text-lg font-bold" style={{color: COUNTRY_COLORS[selectedCountries.destination]?.primary}}>
                                {formatUSDMillion(TRADE_STATISTICS[selectedCountries.destination]?.imports['2024'] || 0)}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <div 
                                className="h-8 rounded-md flex items-center justify-center text-white text-sm font-semibold"
                                style={{
                                  backgroundColor: COUNTRY_COLORS[selectedCountries.destination]?.primary,
                                  width: `${(TRADE_STATISTICS[selectedCountries.destination]?.imports['2024'] || 0) / Math.max(TRADE_STATISTICS[selectedCountries.origin]?.imports['2024'] || 0, TRADE_STATISTICS[selectedCountries.destination]?.imports['2024'] || 0) * 100}%`,
                                  minWidth: '60px'
                                }}
                              >
                                2024
                              </div>
                            </div>
                            <div className="flex gap-2 mt-1">
                              <div 
                                className="h-6 rounded-md flex items-center justify-center text-white text-xs"
                                style={{
                                  backgroundColor: COUNTRY_COLORS[selectedCountries.destination]?.secondary,
                                  width: `${(TRADE_STATISTICS[selectedCountries.destination]?.imports['2023'] || 0) / Math.max(TRADE_STATISTICS[selectedCountries.origin]?.imports['2024'] || 0, TRADE_STATISTICS[selectedCountries.destination]?.imports['2024'] || 0) * 100}%`,
                                  minWidth: '40px',
                                  opacity: 0.7
                                }}
                              >
                                2023
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Graphique Exportations */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-800 mb-4 text-center">Exportations</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium flex items-center gap-2">
                                {countryFlags[selectedCountries.origin]} {TRADE_STATISTICS[selectedCountries.origin]?.name}
                              </span>
                              <span className="text-lg font-bold" style={{color: COUNTRY_COLORS[selectedCountries.origin]?.primary}}>
                                {formatUSDMillion(TRADE_STATISTICS[selectedCountries.origin]?.exports['2024'] || 0)}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <div 
                                className="h-8 rounded-md flex items-center justify-center text-white text-sm font-semibold"
                                style={{
                                  backgroundColor: COUNTRY_COLORS[selectedCountries.origin]?.primary,
                                  width: `${(TRADE_STATISTICS[selectedCountries.origin]?.exports['2024'] || 0) / Math.max(TRADE_STATISTICS[selectedCountries.origin]?.exports['2024'] || 0, TRADE_STATISTICS[selectedCountries.destination]?.exports['2024'] || 0) * 100}%`,
                                  minWidth: '60px'
                                }}
                              >
                                2024
                              </div>
                            </div>
                            <div className="flex gap-2 mt-1">
                              <div 
                                className="h-6 rounded-md flex items-center justify-center text-white text-xs"
                                style={{
                                  backgroundColor: COUNTRY_COLORS[selectedCountries.origin]?.secondary,
                                  width: `${(TRADE_STATISTICS[selectedCountries.origin]?.exports['2023'] || 0) / Math.max(TRADE_STATISTICS[selectedCountries.origin]?.exports['2024'] || 0, TRADE_STATISTICS[selectedCountries.destination]?.exports['2024'] || 0) * 100}%`,
                                  minWidth: '40px',
                                  opacity: 0.7
                                }}
                              >
                                2023
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium flex items-center gap-2">
                                {countryFlags[selectedCountries.destination]} {TRADE_STATISTICS[selectedCountries.destination]?.name}
                              </span>
                              <span className="text-lg font-bold" style={{color: COUNTRY_COLORS[selectedCountries.destination]?.primary}}>
                                {formatUSDMillion(TRADE_STATISTICS[selectedCountries.destination]?.exports['2024'] || 0)}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <div 
                                className="h-8 rounded-md flex items-center justify-center text-white text-sm font-semibold"
                                style={{
                                  backgroundColor: COUNTRY_COLORS[selectedCountries.destination]?.primary,
                                  width: `${(TRADE_STATISTICS[selectedCountries.destination]?.exports['2024'] || 0) / Math.max(TRADE_STATISTICS[selectedCountries.origin]?.exports['2024'] || 0, TRADE_STATISTICS[selectedCountries.destination]?.exports['2024'] || 0) * 100}%`,
                                  minWidth: '60px'
                                }}
                              >
                                2024
                              </div>
                            </div>
                            <div className="flex gap-2 mt-1">
                              <div 
                                className="h-6 rounded-md flex items-center justify-center text-white text-xs"
                                style={{
                                  backgroundColor: COUNTRY_COLORS[selectedCountries.destination]?.secondary,
                                  width: `${(TRADE_STATISTICS[selectedCountries.destination]?.exports['2023'] || 0) / Math.max(TRADE_STATISTICS[selectedCountries.origin]?.exports['2024'] || 0, TRADE_STATISTICS[selectedCountries.destination]?.exports['2024'] || 0) * 100}%`,
                                  minWidth: '40px',
                                  opacity: 0.7
                                }}
                              >
                                2023
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-500 mt-4">
                      Sources : Données officielles OMC, UNCTAD, administrations douanières nationales - Statistiques 2023 et estimations 2024
                    </div>
                  </div>
                </div>

                {/* Top 10 Importations et Exportations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                  {/* Top 10 Importations Pays Origine */}
                  <div className="professional-card">
                    <div className="card-content-pro">
                      <h3 className="card-title-pro mb-lg">
                        📈 Top 10 Importations - {TRADE_STATISTICS[selectedCountries.origin]?.name}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="table-pro">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Produit</th>
                              <th>Code HS</th>
                              <th>Valeur (USD)</th>
                              <th>Part</th>
                            </tr>
                          </thead>
                          <tbody>
                            {TRADE_STATISTICS[selectedCountries.origin]?.top_imports.map((item, index) => {
                              const totalImports = TRADE_STATISTICS[selectedCountries.origin]?.imports['2024'] || 1;
                              const share = ((item.value) / totalImports * 100);
                              return (
                                <tr key={index}>
                                  <td className="font-medium">{index + 1}</td>
                                  <td>{item.product}</td>
                                  <td className="font-mono text-sm">{item.code}</td>
                                  <td className="font-semibold">{formatUSDMillion(item.value)}</td>
                                  <td>{share.toFixed(1)}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Top 10 Exportations Pays Origine */}
                  <div className="professional-card">
                    <div className="card-content-pro">
                      <h3 className="card-title-pro mb-lg">
                        📊 Top 10 Exportations - {TRADE_STATISTICS[selectedCountries.origin]?.name}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="table-pro">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Produit</th>
                              <th>Code HS</th>
                              <th>Valeur (USD)</th>
                              <th>Part</th>
                            </tr>
                          </thead>
                          <tbody>
                            {TRADE_STATISTICS[selectedCountries.origin]?.top_exports.map((item, index) => {
                              const totalExports = TRADE_STATISTICS[selectedCountries.origin]?.exports['2024'] * 1000000 || 1;
                              const share = ((item.value * 1000000) / totalExports * 100);
                              return (
                                <tr key={index}>
                                  <td className="font-medium">{index + 1}</td>
                                  <td>{item.product}</td>
                                  <td className="font-mono text-sm">{item.code}</td>
                                  <td className="font-semibold">{formatCurrency(item.value * 1000000)}</td>
                                  <td>{share.toFixed(1)}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Top 10 Importations Pays Destination */}
                  <div className="professional-card">
                    <div className="card-content-pro">
                      <h3 className="card-title-pro mb-lg">
                        📈 Top 10 Importations - {TRADE_STATISTICS[selectedCountries.destination]?.name}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="table-pro">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Produit</th>
                              <th>Code HS</th>
                              <th>Valeur (USD)</th>
                              <th>Part</th>
                            </tr>
                          </thead>
                          <tbody>
                            {TRADE_STATISTICS[selectedCountries.destination]?.top_imports.map((item, index) => {
                              const totalImports = TRADE_STATISTICS[selectedCountries.destination]?.imports['2024'] * 1000000 || 1;
                              const share = ((item.value * 1000000) / totalImports * 100);
                              return (
                                <tr key={index}>
                                  <td className="font-medium">{index + 1}</td>
                                  <td>{item.product}</td>
                                  <td className="font-mono text-sm">{item.code}</td>
                                  <td className="font-semibold">{formatCurrency(item.value * 1000000)}</td>
                                  <td>{share.toFixed(1)}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Top 10 Exportations Pays Destination */}
                  <div className="professional-card">
                    <div className="card-content-pro">
                      <h3 className="card-title-pro mb-lg">
                        📊 Top 10 Exportations - {TRADE_STATISTICS[selectedCountries.destination]?.name}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="table-pro">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Produit</th>
                              <th>Code HS</th>
                              <th>Valeur (USD)</th>
                              <th>Part</th>
                            </tr>
                          </thead>
                          <tbody>
                            {TRADE_STATISTICS[selectedCountries.destination]?.top_exports.map((item, index) => {
                              const totalExports = TRADE_STATISTICS[selectedCountries.destination]?.exports['2024'] * 1000000 || 1;
                              const share = ((item.value * 1000000) / totalExports * 100);
                              return (
                                <tr key={index}>
                                  <td className="font-medium">{index + 1}</td>
                                  <td>{item.product}</td>
                                  <td className="font-mono text-sm">{item.code}</td>
                                  <td className="font-semibold">{formatCurrency(item.value * 1000000)}</td>
                                  <td>{share.toFixed(1)}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="professional-card">
                <div className="card-content-pro">
                  <div className="text-center py-12 text-gray-600">
                    <div className="text-6xl mb-4">📊</div>
                    <h2 className="text-2xl font-semibold mb-2">Statistiques Bilatérales</h2>
                    <p>Effectuez d'abord un calcul dans l'onglet <strong>Calculateur</strong> pour voir les statistiques détaillées des deux pays sélectionnés.</p>
                    <button
                      className="btn-primary-pro mt-6"
                      onClick={() => setActiveTab('calculator')}
                    >
                      Aller au Calculateur
                    </button>
                  </div>
                </div>
              </div>
            )}
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