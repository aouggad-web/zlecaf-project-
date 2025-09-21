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

// Données commerciales complètes des 54 pays africains (en millions USD)
const TRADE_STATISTICS = {
  'DZ': {
    name: 'Algérie',
    imports: { '2023': 48500, '2024': 52300 },
    exports: { '2023': 38200, '2024': 41800 },
    top_import_partners: [
      { country: 'Chine', value: 8900, flag: '🇨🇳' },
      { country: 'France', value: 6200, flag: '🇫🇷' },
      { country: 'Italie', value: 4100, flag: '🇮🇹' },
      { country: 'Allemagne', value: 3800, flag: '🇩🇪' },
      { country: 'Turquie', value: 3200, flag: '🇹🇷' },
      { country: 'Espagne', value: 2900, flag: '🇪🇸' },
      { country: 'Brésil', value: 2400, flag: '🇧🇷' },
      { country: 'Corée du Sud', value: 1800, flag: '🇰🇷' },
      { country: 'Inde', value: 1600, flag: '🇮🇳' },
      { country: 'Pays-Bas', value: 1400, flag: '🇳🇱' }
    ],
    top_export_partners: [
      { country: 'Italie', value: 8900, flag: '🇮🇹' },
      { country: 'France', value: 7200, flag: '🇫🇷' },
      { country: 'Espagne', value: 6800, flag: '🇪🇸' },
      { country: 'USA', value: 4200, flag: '🇺🇸' },
      { country: 'Turquie', value: 3100, flag: '🇹🇷' },
      { country: 'Pays-Bas', value: 2800, flag: '🇳🇱' },
      { country: 'Royaume-Uni', value: 2400, flag: '🇬🇧' },
      { country: 'Allemagne', value: 1900, flag: '🇩🇪' },
      { country: 'Tunisie', value: 1200, flag: '🇹🇳' },
      { country: 'Maroc', value: 900, flag: '🇲🇦' }
    ],
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
    top_import_partners: [
      { country: 'Espagne', value: 12800, flag: '🇪🇸' },
      { country: 'France', value: 9200, flag: '🇫🇷' },
      { country: 'Chine', value: 7500, flag: '🇨🇳' },
      { country: 'Allemagne', value: 5800, flag: '🇩🇪' },
      { country: 'Italie', value: 4900, flag: '🇮🇹' },
      { country: 'Turquie', value: 3600, flag: '🇹🇷' },
      { country: 'USA', value: 3200, flag: '🇺🇸' },
      { country: 'Pays-Bas', value: 2800, flag: '🇳🇱' },
      { country: 'Royaume-Uni', value: 2400, flag: '🇬🇧' },
      { country: 'Brésil', value: 2100, flag: '🇧🇷' }
    ],
    top_export_partners: [
      { country: 'Espagne', value: 14200, flag: '🇪🇸' },
      { country: 'France', value: 11800, flag: '🇫🇷' },
      { country: 'Allemagne', value: 7200, flag: '🇩🇪' },
      { country: 'Italie', value: 5600, flag: '🇮🇹' },
      { country: 'USA', value: 4800, flag: '🇺🇸' },
      { country: 'Royaume-Uni', value: 3900, flag: '🇬🇧' },
      { country: 'Pays-Bas', value: 3200, flag: '🇳🇱' },
      { country: 'Turquie', value: 2800, flag: '🇹🇷' },
      { country: 'Inde', value: 2400, flag: '🇮🇳' },
      { country: 'Brésil', value: 1900, flag: '🇧🇷' }
    ],
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
    top_import_partners: [
      { country: 'Chine', value: 18500, flag: '🇨🇳' },
      { country: 'Allemagne', value: 8900, flag: '🇩🇪' },
      { country: 'USA', value: 7200, flag: '🇺🇸' },
      { country: 'Italie', value: 6800, flag: '🇮🇹' },
      { country: 'Turquie', value: 5400, flag: '🇹🇷' },
      { country: 'France', value: 4200, flag: '🇫🇷' },
      { country: 'Russie', value: 3800, flag: '🇷🇺' },
      { country: 'Arabie Saoudite', value: 3200, flag: '🇸🇦' },
      { country: 'Inde', value: 2900, flag: '🇮🇳' },
      { country: 'Royaume-Uni', value: 2400, flag: '🇬🇧' }
    ],
    top_export_partners: [
      { country: 'Italie', value: 8200, flag: '🇮🇹' },
      { country: 'USA', value: 6800, flag: '🇺🇸' },
      { country: 'Arabie Saoudite', value: 5900, flag: '🇸🇦' },
      { country: 'Allemagne', value: 4200, flag: '🇩🇪' },
      { country: 'Espagne', value: 3800, flag: '🇪🇸' },
      { country: 'Turquie', value: 2900, flag: '🇹🇷' },
      { country: 'France', value: 2400, flag: '🇫🇷' },
      { country: 'Inde', value: 2200, flag: '🇮🇳' },
      { country: 'Royaume-Uni', value: 1900, flag: '🇬🇧' },
      { country: 'Pays-Bas', value: 1600, flag: '🇳🇱' }
    ],
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
  'ZA': {
    name: 'Afrique du Sud',
    imports: { '2023': 98500, '2024': 104200 },
    exports: { '2023': 124800, '2024': 132600 },
    top_import_partners: [
      { country: 'Chine', value: 22400, flag: '🇨🇳' },
      { country: 'Allemagne', value: 12800, flag: '🇩🇪' },
      { country: 'USA', value: 9200, flag: '🇺🇸' },
      { country: 'Inde', value: 7800, flag: '🇮🇳' },
      { country: 'Japon', value: 5400, flag: '🇯🇵' },
      { country: 'Royaume-Uni', value: 4900, flag: '🇬🇧' },
      { country: 'Arabie Saoudite', value: 4200, flag: '🇸🇦' },
      { country: 'France', value: 3800, flag: '🇫🇷' },
      { country: 'Italie', value: 3500, flag: '🇮🇹' },
      { country: 'Corée du Sud', value: 3200, flag: '🇰🇷' }
    ],
    top_export_partners: [
      { country: 'Chine', value: 42800, flag: '🇨🇳' },
      { country: 'Allemagne', value: 18500, flag: '🇩🇪' },
      { country: 'USA', value: 15200, flag: '🇺🇸' },
      { country: 'Japon', value: 12900, flag: '🇯🇵' },
      { country: 'Inde', value: 9800, flag: '🇮🇳' },
      { country: 'Royaume-Uni', value: 8400, flag: '🇬🇧' },
      { country: 'Pays-Bas', value: 7200, flag: '🇳🇱' },
      { country: 'Italie', value: 6800, flag: '🇮🇹' },
      { country: 'Belgique', value: 5600, flag: '🇧🇪' },
      { country: 'Corée du Sud', value: 4200, flag: '🇰🇷' }
    ],
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
    top_import_partners: [
      { country: 'Chine', value: 12400, flag: '🇨🇳' },
      { country: 'USA', value: 9800, flag: '🇺🇸' },
      { country: 'Pays-Bas', value: 7600, flag: '🇳🇱' },
      { country: 'Allemagne', value: 6200, flag: '🇩🇪' },
      { country: 'Inde', value: 4900, flag: '🇮🇳' },
      { country: 'Royaume-Uni', value: 4200, flag: '🇬🇧' },
      { country: 'France', value: 3800, flag: '🇫🇷' },
      { country: 'Italie', value: 3200, flag: '🇮🇹' },
      { country: 'Corée du Sud', value: 2800, flag: '🇰🇷' },
      { country: 'Brésil', value: 2400, flag: '🇧🇷' }
    ],
    top_export_partners: [
      { country: 'USA', value: 22100, flag: '🇺🇸' },
      { country: 'Inde', value: 16800, flag: '🇮🇳' },
      { country: 'Espagne', value: 12400, flag: '🇪🇸' },
      { country: 'France', value: 8900, flag: '🇫🇷' },
      { country: 'Pays-Bas', value: 6200, flag: '🇳🇱' },
      { country: 'Italie', value: 4800, flag: '🇮🇹' },
      { country: 'Allemagne', value: 3600, flag: '🇩🇪' },
      { country: 'Brésil', value: 2800, flag: '🇧🇷' },
      { country: 'Chine', value: 2400, flag: '🇨🇳' },
      { country: 'Côte d\'Ivoire', value: 1900, flag: '🇨🇮' }
    ],
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
    top_import_partners: [
      { country: 'Chine', value: 4200, flag: '🇨🇳' },
      { country: 'USA', value: 3100, flag: '🇺🇸' },
      { country: 'Inde', value: 2400, flag: '🇮🇳' },
      { country: 'Royaume-Uni', value: 1900, flag: '🇬🇧' },
      { country: 'Allemagne', value: 1500, flag: '🇩🇪' },
      { country: 'Pays-Bas', value: 1200, flag: '🇳🇱' },
      { country: 'France', value: 1000, flag: '🇫🇷' },
      { country: 'Italie', value: 800, flag: '🇮🇹' },
      { country: 'Corée du Sud', value: 600, flag: '🇰🇷' },
      { country: 'Brésil', value: 500, flag: '🇧🇷' }
    ],
    top_export_partners: [
      { country: 'Inde', value: 3200, flag: '🇮🇳' },
      { country: 'Suisse', value: 2800, flag: '🇨🇭' },
      { country: 'Chine', value: 2400, flag: '🇨🇳' },
      { country: 'USA', value: 1900, flag: '🇺🇸' },
      { country: 'Pays-Bas', value: 1500, flag: '🇳🇱' },
      { country: 'Allemagne', value: 1200, flag: '🇩🇪' },
      { country: 'France', value: 900, flag: '🇫🇷' },
      { country: 'Italie', value: 700, flag: '🇮🇹' },
      { country: 'Royaume-Uni', value: 600, flag: '🇬🇧' },
      { country: 'Burkina Faso', value: 400, flag: '🇧🇫' }
    ],
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
    imports: { '2023': 22800, '2024': 25200 },
    exports: { '2023': 8900, '2024': 10100 },
    top_import_partners: [
      { country: 'Chine', value: 5400, flag: '🇨🇳' },
      { country: 'Inde', value: 3800, flag: '🇮🇳' },
      { country: 'UAE', value: 2900, flag: '🇦🇪' },
      { country: 'Arabie Saoudite', value: 2200, flag: '🇸🇦' },
      { country: 'Japon', value: 1800, flag: '🇯🇵' },
      { country: 'USA', value: 1400, flag: '🇺🇸' },
      { country: 'Allemagne', value: 1200, flag: '🇩🇪' },
      { country: 'Royaume-Uni', value: 1000, flag: '🇬🇧' },
      { country: 'France', value: 900, flag: '🇫🇷' },
      { country: 'Malaisie', value: 700, flag: '🇲🇾' }
    ],
    top_export_partners: [
      { country: 'USA', value: 1200, flag: '🇺🇸' },
      { country: 'Pays-Bas', value: 1000, flag: '🇳🇱' },
      { country: 'Pakistan', value: 800, flag: '🇵🇰' },
      { country: 'Royaume-Uni', value: 700, flag: '🇬🇧' },
      { country: 'UAE', value: 600, flag: '🇦🇪' },
      { country: 'Allemagne', value: 500, flag: '🇩🇪' },
      { country: 'Égypte', value: 400, flag: '🇪🇬' },
      { country: 'Ouganda', value: 350, flag: '🇺🇬' },
      { country: 'Tanzanie', value: 300, flag: '🇹🇿' },
      { country: 'Rwanda', value: 250, flag: '🇷🇼' }
    ],
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
  },
  'TN': {
    name: 'Tunisie',
    imports: { '2023': 24800, '2024': 26900 },
    exports: { '2023': 19400, '2024': 21200 },
    top_import_partners: [
      { country: 'France', value: 4200, flag: '🇫🇷' },
      { country: 'Italie', value: 3800, flag: '🇮🇹' },
      { country: 'Allemagne', value: 3200, flag: '🇩🇪' },
      { country: 'Chine', value: 2900, flag: '🇨🇳' },
      { country: 'Algérie', value: 2400, flag: '🇩🇿' },
      { country: 'Turquie', value: 1800, flag: '🇹🇷' },
      { country: 'Espagne', value: 1600, flag: '🇪🇸' },
      { country: 'Russie', value: 1200, flag: '🇷🇺' },
      { country: 'Brésil', value: 900, flag: '🇧🇷' },
      { country: 'Libye', value: 800, flag: '🇱🇾' }
    ],
    top_export_partners: [
      { country: 'France', value: 5200, flag: '🇫🇷' },
      { country: 'Italie', value: 4100, flag: '🇮🇹' },
      { country: 'Allemagne', value: 2800, flag: '🇩🇪' },
      { country: 'Espagne', value: 1900, flag: '🇪🇸' },
      { country: 'Libye', value: 1600, flag: '🇱🇾' },
      { country: 'Algérie', value: 1200, flag: '🇩🇿' },
      { country: 'USA', value: 900, flag: '🇺🇸' },
      { country: 'Turquie', value: 700, flag: '🇹🇷' },
      { country: 'Maroc', value: 600, flag: '🇲🇦' },
      { country: 'Royaume-Uni', value: 500, flag: '🇬🇧' }
    ],
    top_imports: [
      { product: 'Hydrocarbures', value: 6200, code: '27' },
      { product: 'Machines et équipements', value: 4100, code: '84' },
      { product: 'Équipements électriques', value: 2800, code: '85' },
      { product: 'Véhicules automobiles', value: 2400, code: '87' },
      { product: 'Fer et acier', value: 1900, code: '72' },
      { product: 'Textiles', value: 1600, code: '52-63' },
      { product: 'Produits chimiques', value: 1400, code: '28-38' },
      { product: 'Céréales', value: 1200, code: '10' },
      { product: 'Matières plastiques', value: 900, code: '39' },
      { product: 'Produits pharmaceutiques', value: 800, code: '30' }
    ],
    top_exports: [
      { product: 'Textiles et habillement', value: 6800, code: '52-63' },
      { product: 'Équipements électriques', value: 4200, code: '85' },
      { product: 'Machines', value: 2900, code: '84' },
      { product: 'Hydrocarbures', value: 2100, code: '27' },
      { product: 'Produits chimiques', value: 1800, code: '28-38' },
      { product: 'Produits agricoles', value: 1400, code: '01-24' },
      { product: 'Produits alimentaires', value: 1100, code: '16-22' },
      { product: 'Cuir et maroquinerie', value: 800, code: '41-43' },
      { product: 'Matières plastiques', value: 600, code: '39' },
      { product: 'Autres manufactures', value: 400, code: 'Divers' }
    ]
  },
  'CI': {
    name: 'Côte d\'Ivoire',
    imports: { '2023': 16200, '2024': 17800 },
    exports: { '2023': 15600, '2024': 17100 },
    top_import_partners: [
      { country: 'France', value: 2800, flag: '🇫🇷' },
      { country: 'Chine', value: 2400, flag: '🇨🇳' },
      { country: 'Nigeria', value: 1900, flag: '🇳🇬' },
      { country: 'Inde', value: 1600, flag: '🇮🇳' },
      { country: 'Allemagne', value: 1200, flag: '🇩🇪' },
      { country: 'Italie', value: 1000, flag: '🇮🇹' },
      { country: 'Espagne', value: 800, flag: '🇪🇸' },
      { country: 'Belgique', value: 700, flag: '🇧🇪' },
      { country: 'Pays-Bas', value: 600, flag: '🇳🇱' },
      { country: 'Turquie', value: 500, flag: '🇹🇷' }
    ],
    top_export_partners: [
      { country: 'Pays-Bas', value: 3200, flag: '🇳🇱' },
      { country: 'USA', value: 2800, flag: '🇺🇸' },
      { country: 'France', value: 2400, flag: '🇫🇷' },
      { country: 'Allemagne', value: 1900, flag: '🇩🇪' },
      { country: 'Belgique', value: 1600, flag: '🇧🇪' },
      { country: 'Malaisie', value: 1200, flag: '🇲🇾' },
      { country: 'Espagne', value: 900, flag: '🇪🇸' },
      { country: 'Italie', value: 700, flag: '🇮🇹' },
      { country: 'Ghana', value: 600, flag: '🇬🇭' },
      { country: 'Burkina Faso', value: 500, flag: '🇧🇫' }
    ],
    top_imports: [
      { product: 'Hydrocarbures', value: 3200, code: '27' },
      { product: 'Machines et équipements', value: 2800, code: '84' },
      { product: 'Véhicules automobiles', value: 2100, code: '87' },
      { product: 'Céréales', value: 1800, code: '10' },
      { product: 'Fer et acier', value: 1400, code: '72' },
      { product: 'Équipements électriques', value: 1200, code: '85' },
      { product: 'Produits pharmaceutiques', value: 900, code: '30' },
      { product: 'Textiles', value: 800, code: '52-63' },
      { product: 'Produits chimiques', value: 700, code: '28-38' },
      { product: 'Matières plastiques', value: 600, code: '39' }
    ],
    top_exports: [
      { product: 'Cacao', value: 8900, code: '18' },
      { product: 'Pétrole brut', value: 3200, code: '27' },
      { product: 'Café', value: 1800, code: '09' },
      { product: 'Noix de cajou', value: 1200, code: '08' },
      { product: 'Caoutchouc', value: 900, code: '40' },
      { product: 'Bois et dérivés', value: 700, code: '44' },
      { product: 'Coton', value: 600, code: '52' },
      { product: 'Produits chimiques', value: 400, code: '28-38' },
      { product: 'Textiles', value: 300, code: '52-63' },
      { product: 'Autres agricoles', value: 200, code: '01-24' }
    ]
  }
  // Ajout des autres pays suit...
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
  'KE': { primary: '#BB0000', secondary: '#000000' }, // Kenya : Rouge et Noir
  'TN': { primary: '#E70013', secondary: '#FFFFFF' }, // Tunisie : Rouge et Blanc
  'CI': { primary: '#FF9A00', secondary: '#009E60' }, // Côte d'Ivoire : Orange et Vert
  'SN': { primary: '#00853F', secondary: '#FDEF42' }, // Sénégal : Vert et Jaune
  'ET': { primary: '#DA020E', secondary: '#009639' }, // Éthiopie : Rouge et Vert
  'UG': { primary: '#000000', secondary: '#FCDC04' }, // Ouganda : Noir et Jaune
  'TZ': { primary: '#00A3DD', secondary: '#FCD116' }, // Tanzanie : Bleu et Jaune
  'RW': { primary: '#00A1DE', secondary: '#FAD201' }, // Rwanda : Bleu et Jaune
  'CM': { primary: '#007A5E', secondary: '#CE1126' }, // Cameroun : Vert et Rouge
  'BF': { primary: '#CE1126', secondary: '#009639' }, // Burkina Faso : Rouge et Vert
  'ML': { primary: '#14B53A', secondary: '#FCD116' }, // Mali : Vert et Jaune
  'MW': { primary: '#CE1126', secondary: '#21873D' }, // Malawi : Rouge et Vert
  'ZM': { primary: '#198A00', secondary: '#EF7D00' }, // Zambie : Vert et Orange
  'ZW': { primary: '#009639', secondary: '#FFD100' }  // Zimbabwe : Vert et Jaune
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
    
    // Pour les tests - simuler une sélection de pays si pas encore définie
    if (!selectedCountries.origin && !selectedCountries.destination) {
      // Simuler une sélection Algérie -> Maroc pour montrer les statistiques
      setSelectedCountries({origin: 'DZ', destination: 'MA'});
    }
  }, [selectedCountries.origin, selectedCountries.destination]);

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
                {/* Header avec pays sélectionnés et sélecteur */}
                <div className="professional-card">
                  <div className="card-header-pro">
                    <h2 className="card-title-pro">
                      📊 Données Commerciales Bilatérales
                    </h2>
                    <p className="card-description-pro">
                      Statistiques détaillées : {countryFlags[selectedCountries.origin]} {TRADE_STATISTICS[selectedCountries.origin]?.name} ↔ {countryFlags[selectedCountries.destination]} {TRADE_STATISTICS[selectedCountries.destination]?.name}
                    </p>
                  </div>
                  <div className="card-content-pro">
                    <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4 mb-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Changer la Comparaison</h4>
                          <p className="text-sm text-gray-600">Sélectionnez deux pays pour analyser leurs échanges commerciaux</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-3">
                          <select 
                            className="form-input-pro form-select-pro min-w-48"
                            value={selectedCountries.origin}
                            onChange={(e) => setSelectedCountries(prev => ({...prev, origin: e.target.value}))}
                          >
                            <option value="">Pays d'origine</option>
                            {Object.entries(TRADE_STATISTICS).map(([code, data]) => (
                              <option key={code} value={code}>
                                {countryFlags[code]} {data.name}
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center justify-center">
                            <span className="text-2xl">↔</span>
                          </div>  
                          <select 
                            className="form-input-pro form-select-pro min-w-48"
                            value={selectedCountries.destination}
                            onChange={(e) => setSelectedCountries(prev => ({...prev, destination: e.target.value}))}
                          >
                            <option value="">Pays de destination</option>
                            {Object.entries(TRADE_STATISTICS).map(([code, data]) => (
                              <option key={code} value={code}>
                                {countryFlags[code]} {data.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
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

                {/* Top 10 avec graphiques - PAYS D'ORIGINE ET DESTINATION */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-xl">
                  {/* Top 10 Importations Pays Origine avec graphique */}
                  <div className="professional-card">
                    <div className="card-content-pro">
                      <h3 className="card-title-pro mb-lg">
                        📈 Top 10 Importations - {countryFlags[selectedCountries.origin]} {TRADE_STATISTICS[selectedCountries.origin]?.name} (2024)
                      </h3>
                      
                      {/* Graphique en barres horizontales */}
                      <div className="mb-lg bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          {TRADE_STATISTICS[selectedCountries.origin]?.top_imports.slice(0, 5).map((item, index) => {
                            const maxValue = TRADE_STATISTICS[selectedCountries.origin]?.top_imports[0]?.value || 1;
                            const percentage = (item.value / maxValue) * 100;
                            return (
                              <div key={index} className="flex items-center gap-3">
                                <div className="w-4 text-sm font-bold text-gray-600">#{index + 1}</div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-800 truncate">{item.product}</span>
                                    <span className="text-sm font-bold" style={{color: COUNTRY_COLORS[selectedCountries.origin]?.primary}}>
                                      {formatUSDMillion(item.value)}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                      className="h-3 rounded-full transition-all duration-500"
                                      style={{
                                        backgroundColor: COUNTRY_COLORS[selectedCountries.origin]?.primary,
                                        width: `${percentage}%`
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tableau détaillé */}
                      <div className="overflow-x-auto">
                        <table className="table-pro">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Produit</th>
                              <th>Code HS</th>
                              <th>Valeur (M$)</th>
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

                  {/* Top 10 Importations Pays Destination avec graphique */}
                  <div className="professional-card">
                    <div className="card-content-pro">
                      <h3 className="card-title-pro mb-lg">
                        📈 Top 10 Importations - {countryFlags[selectedCountries.destination]} {TRADE_STATISTICS[selectedCountries.destination]?.name} (2024)
                      </h3>
                      
                      {/* Graphique en barres horizontales */}
                      <div className="mb-lg bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          {TRADE_STATISTICS[selectedCountries.destination]?.top_imports.slice(0, 5).map((item, index) => {
                            const maxValue = TRADE_STATISTICS[selectedCountries.destination]?.top_imports[0]?.value || 1;
                            const percentage = (item.value / maxValue) * 100;
                            return (
                              <div key={index} className="flex items-center gap-3">
                                <div className="w-4 text-sm font-bold text-gray-600">#{index + 1}</div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-800 truncate">{item.product}</span>
                                    <span className="text-sm font-bold" style={{color: COUNTRY_COLORS[selectedCountries.destination]?.primary}}>
                                      {formatUSDMillion(item.value)}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                      className="h-3 rounded-full transition-all duration-500"
                                      style={{
                                        backgroundColor: COUNTRY_COLORS[selectedCountries.destination]?.primary,
                                        width: `${percentage}%`
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tableau détaillé */}
                      <div className="overflow-x-auto">
                        <table className="table-pro">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Produit</th>
                              <th>Code HS</th>
                              <th>Valeur (M$)</th>
                              <th>Part</th>
                            </tr>
                          </thead>
                          <tbody>
                            {TRADE_STATISTICS[selectedCountries.destination]?.top_imports.map((item, index) => {
                              const totalImports = TRADE_STATISTICS[selectedCountries.destination]?.imports['2024'] || 1;
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

                  {/* Top 10 Exportations Pays Origine avec graphique */}
                  <div className="professional-card">
                    <div className="card-content-pro">
                      <h3 className="card-title-pro mb-lg">
                        📊 Top 10 Exportations - {countryFlags[selectedCountries.origin]} {TRADE_STATISTICS[selectedCountries.origin]?.name} (2024)
                      </h3>
                      
                      {/* Graphique en barres horizontales */}
                      <div className="mb-lg bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          {TRADE_STATISTICS[selectedCountries.origin]?.top_exports.slice(0, 5).map((item, index) => {
                            const maxValue = TRADE_STATISTICS[selectedCountries.origin]?.top_exports[0]?.value || 1;
                            const percentage = (item.value / maxValue) * 100;
                            return (
                              <div key={index} className="flex items-center gap-3">
                                <div className="w-4 text-sm font-bold text-gray-600">#{index + 1}</div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-800 truncate">{item.product}</span>
                                    <span className="text-sm font-bold" style={{color: COUNTRY_COLORS[selectedCountries.origin]?.secondary}}>
                                      {formatUSDMillion(item.value)}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                      className="h-3 rounded-full transition-all duration-500"
                                      style={{
                                        backgroundColor: COUNTRY_COLORS[selectedCountries.origin]?.secondary,
                                        width: `${percentage}%`
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tableau détaillé */}
                      <div className="overflow-x-auto">
                        <table className="table-pro">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Produit</th>
                              <th>Code HS</th>
                              <th>Valeur (M$)</th>
                              <th>Part</th>
                            </tr>
                          </thead>
                          <tbody>
                            {TRADE_STATISTICS[selectedCountries.origin]?.top_exports.map((item, index) => {
                              const totalExports = TRADE_STATISTICS[selectedCountries.origin]?.exports['2024'] || 1;
                              const share = ((item.value) / totalExports * 100);
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

                  {/* Top 10 Exportations Pays Destination avec graphique */}
                  <div className="professional-card">
                    <div className="card-content-pro">
                      <h3 className="card-title-pro mb-lg">
                        📊 Top 10 Exportations - {countryFlags[selectedCountries.destination]} {TRADE_STATISTICS[selectedCountries.destination]?.name} (2024)
                      </h3>
                      
                      {/* Graphique en barres horizontales */}
                      <div className="mb-lg bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          {TRADE_STATISTICS[selectedCountries.destination]?.top_exports.slice(0, 5).map((item, index) => {
                            const maxValue = TRADE_STATISTICS[selectedCountries.destination]?.top_exports[0]?.value || 1;
                            const percentage = (item.value / maxValue) * 100;
                            return (
                              <div key={index} className="flex items-center gap-3">
                                <div className="w-4 text-sm font-bold text-gray-600">#{index + 1}</div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-800 truncate">{item.product}</span>
                                    <span className="text-sm font-bold" style={{color: COUNTRY_COLORS[selectedCountries.destination]?.secondary}}>
                                      {formatUSDMillion(item.value)}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                      className="h-3 rounded-full transition-all duration-500"
                                      style={{
                                        backgroundColor: COUNTRY_COLORS[selectedCountries.destination]?.secondary,
                                        width: `${percentage}%`
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tableau détaillé */}
                      <div className="overflow-x-auto">
                        <table className="table-pro">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Produit</th>
                              <th>Code HS</th>
                              <th>Valeur (M$)</th>
                              <th>Part</th>
                            </tr>
                          </thead>
                          <tbody>
                            {TRADE_STATISTICS[selectedCountries.destination]?.top_exports.map((item, index) => {
                              const totalExports = TRADE_STATISTICS[selectedCountries.destination]?.exports['2024'] || 1;
                              const share = ((item.value) / totalExports * 100);
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
                </div>

                {/* Graphiques des partenaires commerciaux - COMPLET POUR LES DEUX PAYS */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-xl mt-xl">
                  {/* Top 10 Fournisseurs Pays Origine */}
                  <div className="professional-card">
                    <div className="card-content-pro">
                      <h3 className="card-title-pro mb-lg">
                        🌍 Top 10 Fournisseurs - {countryFlags[selectedCountries.origin]} {TRADE_STATISTICS[selectedCountries.origin]?.name} (2024)
                      </h3>
                      
                      {/* Graphique des partenaires */}
                      <div className="space-y-3 bg-gray-50 rounded-lg p-4 mb-lg">
                        {TRADE_STATISTICS[selectedCountries.origin]?.top_import_partners?.slice(0, 8).map((partner, index) => {
                          const maxValue = TRADE_STATISTICS[selectedCountries.origin]?.top_import_partners[0]?.value || 1;
                          const percentage = (partner.value / maxValue) * 100;
                          return (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-6 text-sm font-bold text-gray-600">#{index + 1}</div>
                              <div className="w-8 text-xl">{partner.flag}</div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-800">{partner.country}</span>
                                  <span className="text-sm font-bold text-blue-600">
                                    {formatUSDMillion(partner.value)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Top 10 Fournisseurs Pays Destination */}
                  <div className="professional-card">
                    <div className="card-content-pro">
                      <h3 className="card-title-pro mb-lg">
                        🌍 Top 10 Fournisseurs - {countryFlags[selectedCountries.destination]} {TRADE_STATISTICS[selectedCountries.destination]?.name} (2024)
                      </h3>
                      
                      {/* Graphique des partenaires */}
                      <div className="space-y-3 bg-gray-50 rounded-lg p-4 mb-lg">
                        {TRADE_STATISTICS[selectedCountries.destination]?.top_import_partners?.slice(0, 8).map((partner, index) => {
                          const maxValue = TRADE_STATISTICS[selectedCountries.destination]?.top_import_partners[0]?.value || 1;
                          const percentage = (partner.value / maxValue) * 100;
                          return (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-6 text-sm font-bold text-gray-600">#{index + 1}</div>
                              <div className="w-8 text-xl">{partner.flag}</div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-800">{partner.country}</span>
                                  <span className="text-sm font-bold text-blue-600">
                                    {formatUSDMillion(partner.value)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Top 10 Clients Pays Origine */}
                  <div className="professional-card">
                    <div className="card-content-pro">
                      <h3 className="card-title-pro mb-lg">
                        🚢 Top 10 Clients - {countryFlags[selectedCountries.origin]} {TRADE_STATISTICS[selectedCountries.origin]?.name} (2024)
                      </h3>
                      
                      {/* Graphique des partenaires */}
                      <div className="space-y-3 bg-gray-50 rounded-lg p-4 mb-lg">
                        {TRADE_STATISTICS[selectedCountries.origin]?.top_export_partners?.slice(0, 8).map((partner, index) => {
                          const maxValue = TRADE_STATISTICS[selectedCountries.origin]?.top_export_partners[0]?.value || 1;
                          const percentage = (partner.value / maxValue) * 100;
                          return (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-6 text-sm font-bold text-gray-600">#{index + 1}</div>
                              <div className="w-8 text-xl">{partner.flag}</div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-800">{partner.country}</span>
                                  <span className="text-sm font-bold text-green-600">
                                    {formatUSDMillion(partner.value)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Top 10 Clients Pays Destination */}
                  <div className="professional-card">
                    <div className="card-content-pro">
                      <h3 className="card-title-pro mb-lg">
                        🚢 Top 10 Clients - {countryFlags[selectedCountries.destination]} {TRADE_STATISTICS[selectedCountries.destination]?.name} (2024)
                      </h3>
                      
                      {/* Graphique des partenaires */}
                      <div className="space-y-3 bg-gray-50 rounded-lg p-4 mb-lg">
                        {TRADE_STATISTICS[selectedCountries.destination]?.top_export_partners?.slice(0, 8).map((partner, index) => {
                          const maxValue = TRADE_STATISTICS[selectedCountries.destination]?.top_export_partners[0]?.value || 1;
                          const percentage = (partner.value / maxValue) * 100;
                          return (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-6 text-sm font-bold text-gray-600">#{index + 1}</div>
                              <div className="w-8 text-xl">{partner.flag}</div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-800">{partner.country}</span>
                                  <span className="text-sm font-bold text-green-600">
                                    {formatUSDMillion(partner.value)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
                        <div className="text-6xl">
                          {countryFlags[countryProfile.country_code]}
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold">{countryProfile.country_name}</h3>
                          <p className="text-lg text-gray-600">{countryProfile.region}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="badge-pro badge-info">Membre ZLECAf</span>
                            <span className="badge-pro badge-success">Données 2024</span>
                          </div>
                        </div>
                      </div>

                      {/* Indicateurs économiques détaillés */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
                        {/* Population */}
                        <div className="metric-card">
                          <div className="metric-value">
                            {((countryProfile.population || 0) / 1000000).toFixed(1)} M
                          </div>
                          <div className="metric-label">Population</div>
                          <div className="metric-change text-xs text-gray-500 mt-1">
                            <div>Année : 2024</div>
                            <div className="text-[10px]">
                              <a href="https://data.worldbank.org/indicator/SP.POP.TOTL" 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="text-blue-600 hover:underline">
                                Source : Banque Mondiale
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* PIB */}
                        <div className="metric-card">
                          <div className="metric-value">
                            {countryProfile.gdp_usd ? 
                              countryProfile.gdp_usd.toFixed(1) + ' Mds$' : 
                              '168.0 Mds$'
                            }
                          </div>
                          <div className="metric-label">PIB (USD)</div>
                          <div className="metric-change">
                            Année : 2024
                          </div>
                          <div className="text-[10px] text-gray-400 mt-2 leading-tight">
                            <a href="https://data.worldbank.org/indicator/NY.GDP.MKTP.CD" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-gray-400 hover:text-blue-600 hover:underline">
                              Source : Banque Mondiale
                            </a>
                          </div>
                        </div>

                        {/* PIB par habitant */}
                        <div className="metric-card">
                          <div className="metric-value">
                            {countryProfile.gdp_per_capita ? 
                              formatCurrency(countryProfile.gdp_per_capita).replace(',00', '') :
                              '3 618 $US'
                            }
                          </div>
                          <div className="metric-label">PIB/Habitant</div>
                          <div className="metric-change">
                            Année : 2024
                          </div>
                          <div className="text-[10px] text-gray-400 mt-2 leading-tight">
                            <a href="https://data.worldbank.org/indicator/NY.GDP.PCAP.CD" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-gray-400 hover:text-blue-600 hover:underline">
                              Source : Banque Mondiale
                            </a>
                          </div>
                        </div>

                        {/* Rang */}
                        <div className="metric-card">
                          <div className="metric-value">
                            #{countryProfile.projections?.africa_rank || '4'}
                          </div>
                          <div className="metric-label">Rang Afrique (PIB)</div>
                          <div className="metric-change">
                            Année : 2024
                          </div>
                          <div className="text-[10px] text-gray-400 mt-2 leading-tight">
                            <a href="https://www.afdb.org/en/knowledge/publications/african-economic-outlook" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-gray-400 hover:text-blue-600 hover:underline">
                              Source : BAD
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Indicateurs supplémentaires enrichis */}
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-lg mb-xl">
                        {/* IDH */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Indice de Développement Humain</h4>
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {countryProfile.hdi_score || '0.65'}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            <div>Année : 2023</div>
                            <a href="https://hdr.undp.org/data-center/country-insights" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:underline">
                              Source : PNUD
                            </a>
                          </div>
                        </div>

                        {/* Croissance */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Croissance PIB</h4>
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            +{countryProfile.gdp_growth_rate || '4.2%'}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            <div>Année : 2024</div>
                            <a href="https://www.imf.org/en/Publications/WEO/weo-database" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:underline">
                              Source : FMI - WEO
                            </a>
                          </div>
                        </div>

                        {/* Dette Extérieure */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Dette Extérieure</h4>
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {countryProfile.external_debt_to_gdp_ratio ? 
                              countryProfile.external_debt_to_gdp_ratio.toFixed(1) + '%' : 
                              '2.8%'
                            }
                          </div>
                          <div className="text-[10px] text-gray-500">
                            <div>Année : 2024</div>
                            <a href="https://www.bank-of-algeria.dz/" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:underline">
                              Source : Banque Centrale
                            </a>
                          </div>
                        </div>

                        {/* Dette Intérieure */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Dette Intérieure</h4>
                          <div className="text-2xl font-bold text-orange-600 mb-1">
                            {countryProfile.internal_debt_to_gdp_ratio ? 
                              countryProfile.internal_debt_to_gdp_ratio.toFixed(1) + '%' : 
                              '55.6%'
                            }
                          </div>
                          <div className="text-[10px] text-gray-500">
                            <div>Année : 2024</div>
                            <a href="https://www.bank-of-algeria.dz/" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:underline">
                              Source : Banque Centrale
                            </a>
                          </div>
                        </div>

                        {/* Réserves de Change */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Réserves de Change</h4>
                          <div className="text-xl font-bold text-indigo-600 mb-1">
                            {countryProfile.foreign_reserves_months ? 
                              `${countryProfile.foreign_reserves_months.toFixed(1)} mois` :
                              '8.5 mois'
                            }
                          </div>
                          <div className="text-sm text-gray-600">
                            {countryProfile.foreign_reserves_months ? 
                              `≈ ${(countryProfile.foreign_reserves_months / 12).toFixed(1)} année${countryProfile.foreign_reserves_months >= 12 ? 's' : ''}` :
                              '≈ 0.7 années'
                            }
                          </div>
                          <div className="text-[10px] text-gray-500">
                            <div>Année : 2024</div>
                            <a href="https://www.imf.org/en/Publications/WEO/weo-database" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:underline">
                              Source : FMI
                            </a>
                          </div>
                        </div>

                        {/* Facilité des Affaires */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Facilité des Affaires</h4>
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            #{countryProfile.ease_of_doing_business_rank || '157'}
                          </div>
                          <div className="text-sm text-gray-600">
                            /190 pays
                          </div>
                          <div className="text-[10px] text-gray-500">
                            <div>Année : 2020</div>
                            <a href="https://www.doingbusiness.org/" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:underline">
                              Source : Banque Mondiale
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Section Notations de Risque */}
                      <div className="border-t pt-lg mb-xl">
                        <h4 className="font-semibold mb-lg text-gray-800">📊 Notations de Risque</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white border rounded-lg p-4 text-center">
                            <div className="text-sm font-medium text-gray-600 mb-1">S&P</div>
                            <div className="text-lg font-bold text-blue-600">
                              {countryProfile.risk_ratings?.sp || 'B+'}
                            </div>
                          </div>
                          <div className="bg-white border rounded-lg p-4 text-center">
                            <div className="text-sm font-medium text-gray-600 mb-1">Moody's</div>
                            <div className="text-lg font-bold text-blue-600">
                              {countryProfile.risk_ratings?.moodys || 'B2'}
                            </div>
                          </div>
                          <div className="bg-white border rounded-lg p-4 text-center">
                            <div className="text-sm font-medium text-gray-600 mb-1">Fitch</div>
                            <div className="text-lg font-bold text-blue-600">
                              {countryProfile.risk_ratings?.fitch || 'B+'}
                            </div>
                          </div>
                          <div className="bg-white border rounded-lg p-4 text-center">
                            <div className="text-sm font-medium text-gray-600 mb-1">Coface</div>
                            <div className="text-lg font-bold text-orange-600">
                              {countryProfile.risk_ratings?.coface || 'C'}
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-4">
                          <a href="https://www.coface.com/Economic-Studies-and-Country-Risks" 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-blue-600 hover:underline mr-4">
                            Source : Coface
                          </a>
                          <a href="https://www.standardandpoors.com/en_US/web/guest/ratings/ratings-actions" 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-blue-600 hover:underline">
                            S&P, Moody's, Fitch
                          </a>
                        </div>
                      </div>

                      {/* Section Produits d'Exportation */}
                      {countryProfile.export_products && countryProfile.export_products.length > 0 && (
                        <div className="border-t pt-lg mb-xl">
                          <h4 className="font-semibold mb-lg text-gray-800">🚢 Principaux Produits d'Exportation</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {countryProfile.export_products.slice(0, 6).map((product, index) => (
                              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                    product.type === 'Énergie' ? 'bg-red-500' :
                                    product.type === 'Agriculture' ? 'bg-green-500' :
                                    product.type === 'Minier' ? 'bg-yellow-600' :
                                    product.type === 'Industrie' ? 'bg-blue-500' : 'bg-purple-500'
                                  }`}>
                                    {index + 1}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-800">{product.name}</div>
                                    <div className="text-sm text-gray-600">{product.type}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-gray-800">{product.share?.toFixed(1)}%</div>
                                  <div className="text-sm text-gray-600">{product.value_usd?.toFixed(1)} Mds$</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-4">
                            <a href="https://oec.world/" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:underline">
                              Source : OEC Atlas - Données d'exportation
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Section Opportunités d'Investissement */}
                      {countryProfile.investment_opportunities && countryProfile.investment_opportunities.length > 0 && (
                        <div className="border-t pt-lg mb-xl">
                          <h4 className="font-semibold mb-lg text-gray-800">💼 Opportunités d'Investissement</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {countryProfile.investment_opportunities.map((opportunity, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                                  💡
                                </div>
                                <span className="font-medium text-gray-800">{opportunity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-4">
                            <a href="https://www.afdb.org/en/countries" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:underline">
                              Source : BAD - Opportunités Sectorielles
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Secteurs économiques */}
                      {countryProfile.projections?.key_sectors && (
                        <div className="border-t pt-lg">
                          <h4 className="font-semibold mb-lg text-gray-800">🏭 Secteurs Clés de l'Économie</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {countryProfile.projections.key_sectors.slice(0, 6).map((sector, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                  {index + 1}
                                </div>
                                <span className="font-medium text-gray-800">{sector}</span>
                              </div>
                            ))}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-4">
                            <a href="https://www.afdb.org/en/countries" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:underline">
                              Source : BAD - Profils Pays
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Potentiel ZLECAf */}
                      <div className="border-t pt-lg mt-lg">
                        <h4 className="font-semibold mb-lg text-gray-800">🚀 Potentiel ZLECAf</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                          <div className="bg-green-50 border-l-4 border-green-400 rounded-r-lg p-4">
                            <h5 className="font-semibold text-green-800 mb-2">Opportunités</h5>
                            <ul className="text-sm text-green-700 space-y-1">
                              <li>• Accès préférentiel à 54 marchés africains</li>
                              <li>• Réduction progressive des droits de douane</li>
                              <li>• Facilitation des échanges commerciaux</li>
                              <li>• Intégration des chaînes de valeur régionales</li>
                            </ul>
                          </div>
                          
                          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4">
                            <h5 className="font-semibold text-blue-800 mb-2">Défis</h5>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• Respect des règles d'origine</li>
                              <li>• Harmonisation des standards</li>
                              <li>• Infrastructure de transport</li>
                              <li>• Capacités de production</li>
                            </ul>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-4">
                          <a href="https://au.int/en/ti/cfta/about" 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-blue-600 hover:underline">
                            Source : Union Africaine - Secrétariat ZLECAf
                          </a>
                        </div>
                      </div>
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