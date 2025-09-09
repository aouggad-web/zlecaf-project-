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
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('calculator');

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

  const fetchCountryProfile = async (countryCode) => {
    try {
      const response = await axios.get(`${API}/country-profile/${countryCode}`);
      setCountryProfile(response.data);
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
      
      toast({
        title: "Calcul réussi",
        description: `Économie potentielle: ${formatCurrency(response.data.savings)}`,
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
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  };

  const getSectorName = (hsCode) => {
    const sectorNames = {
      '01': 'Animaux vivants',
      '02': 'Viandes et abats',
      '03': 'Poissons et crustacés',
      '04': 'Produits laitiers',
      '05': 'Autres produits d\'origine animale',
      '06': 'Plantes vivantes',
      '07': 'Légumes',
      '08': 'Fruits',
      '09': 'Café, thé, épices',
      '10': 'Céréales',
      '11': 'Produits de la minoterie',
      '12': 'Graines et fruits oléagineux',
      '13': 'Gommes, résines',
      '14': 'Matières à tresser',
      '15': 'Graisses et huiles',
      '16': 'Préparations de viande',
      '17': 'Sucres et sucreries',
      '18': 'Cacao et ses préparations',
      '19': 'Préparations de céréales',
      '20': 'Préparations de légumes',
      '21': 'Préparations alimentaires diverses',
      '22': 'Boissons',
      '23': 'Résidus industries alimentaires',
      '24': 'Tabacs',
      '25': 'Sel, soufre, terres et pierres',
      '26': 'Minerais',
      '27': 'Combustibles minéraux',
      '28': 'Produits chimiques inorganiques',
      '29': 'Produits chimiques organiques',
      '30': 'Produits pharmaceutiques',
      '84': 'Machines et appareils mécaniques',
      '85': 'Machines et appareils électriques',
      '87': 'Véhicules automobiles',
      '61': 'Vêtements en bonneterie',
      '62': 'Vêtements, autres qu\'en bonneterie',
      '72': 'Fonte, fer et acier',
    };
    
    const sector = hsCode.substring(0, 2);
    return sectorNames[sector] || `Secteur ${sector}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-green-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🌍</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Système Commercial ZLECAf
              </h1>
              <p className="text-gray-600 mt-1">
                Calculateur de Bénéfices & Règles d'Origine - Données Officielles
              </p>
              <div className="flex space-x-2 mt-2">
                <Badge variant="outline">Union Africaine</Badge>
                <Badge variant="outline">Banque Mondiale</Badge>
                <Badge variant="outline">UNCTAD</Badge>
                <Badge variant="outline">OEC</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculator">Calculateur</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
            <TabsTrigger value="rules">Règles d'Origine</TabsTrigger>
            <TabsTrigger value="profiles">Profils Pays</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulaire de calcul */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>📊</span>
                    <span>Calculateur ZLECAf Complet</span>
                  </CardTitle>
                  <CardDescription>
                    Calculs basés sur les données officielles des organismes internationaux
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin">Pays d'origine</Label>
                      <Select value={originCountry} onValueChange={setOriginCountry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name} ({formatNumber(country.population)} hab.)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination">Pays partenaire</Label>
                      <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pays partenaire" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name} ({formatNumber(country.population)} hab.)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hs-code">Code SH6 (6 chiffres)</Label>
                    <Input
                      id="hs-code"
                      value={hsCode}
                      onChange={(e) => setHsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Ex : 010121, 180100..."
                      maxLength={6}
                    />
                    {hsCode.length >= 2 && (
                      <p className="text-sm text-blue-600">
                        Secteur: {getSectorName(hsCode)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Valeur de la marchandise (FCFA)</Label>
                    <Input
                      id="value"
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="1000000"
                      min="0"
                    />
                  </div>

                  <Button 
                    onClick={calculateTariff}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    {loading ? 'Calcul en cours...' : 'Calculer avec Données Officielles'}
                  </Button>
                </CardContent>
              </Card>

              {/* Résultats complets */}
              {result && (
                <div className="space-y-4">
                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-green-700">
                        <span>💰</span>
                        <span>Résultats Détaillés</span>
                      </CardTitle>
                      <CardDescription>
                        {getCountryName(result.origin_country)} → {getCountryName(result.destination_country)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Tarif Normal</p>
                          <p className="text-2xl font-bold text-red-600">
                            {formatCurrency(result.normal_tariff_amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(result.normal_tariff_rate * 100).toFixed(1)}% de {formatCurrency(result.value)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Tarif ZLECAf</p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(result.zlecaf_tariff_amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(result.zlecaf_tariff_rate * 100).toFixed(1)}% de {formatCurrency(result.value)}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="text-center space-y-2">
                        <p className="text-sm font-medium text-gray-600">Économie Réalisée</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {formatCurrency(result.savings)}
                        </p>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {result.savings_percentage.toFixed(1)}% d'économie
                        </Badge>
                        <Progress value={result.savings_percentage} className="w-full mt-2" />
                      </div>

                      {/* Règles d'origine */}
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-amber-800 mb-2">Règles d'Origine ZLECAf</h4>
                        <p className="text-sm text-amber-700">
                          <strong>Type:</strong> {result.rules_of_origin.rule}
                        </p>
                        <p className="text-sm text-amber-700">
                          <strong>Exigence:</strong> {result.rules_of_origin.requirement}
                        </p>
                        <Progress 
                          value={result.rules_of_origin.regional_content} 
                          className="w-full mt-2"
                        />
                        <p className="text-xs text-amber-600 mt-1">
                          Contenu régional minimum: {result.rules_of_origin.regional_content}%
                        </p>
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
                                {index + 1}. {producer.country_name}
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
                {/* Vue d'ensemble */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Calculs Totaux</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-blue-600">
                        {formatNumber(statistics.overview.total_calculations)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Économies Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(statistics.overview.total_savings)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Population Africaine</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-purple-600">
                        {(statistics.overview.combined_population / 1000000000).toFixed(1)}B
                      </p>
                      <p className="text-sm text-gray-600">habitants</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">PIB Estimé</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-orange-600">
                        ${(statistics.overview.estimated_combined_gdp / 1000000000000).toFixed(1)}T
                      </p>
                      <p className="text-sm text-gray-600">USD</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Impact ZLECAf */}
                <Card>
                  <CardHeader>
                    <CardTitle>Impact Économique ZLECAf</CardTitle>
                    <CardDescription>Projections basées sur les données officielles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Impacts Actuels</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Réduction tarifaire moyenne:</span>
                            <Badge variant="secondary">{statistics.zlecaf_impact.average_tariff_reduction}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Commerce intra-africain actuel:</span>
                            <Badge variant="outline">{statistics.zlecaf_impact.current_intra_african_trade}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Objectif 2030:</span>
                            <Badge variant="default">{statistics.zlecaf_impact.intra_african_trade_target}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Potentiel Économique</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Création commerciale estimée:</span>
                            <Badge variant="secondary">{statistics.zlecaf_impact.estimated_trade_creation}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Création d'emplois potentielle:</span>
                            <Badge variant="outline">{statistics.zlecaf_impact.job_creation_potential}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistiques détaillées */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pays les Plus Actifs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {statistics.trade_statistics.most_active_countries.map((country, index) => (
                          <div key={country._id} className="flex justify-between items-center">
                            <span className="text-sm">
                              {index + 1}. {getCountryName(country._id)}
                            </span>
                            <Badge variant="outline">{country.count} calculs</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Secteurs Bénéficiaires</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {statistics.trade_statistics.top_beneficiary_sectors.map((sector, index) => (
                          <div key={sector._id} className="flex justify-between items-center">
                            <span className="text-sm">
                              {index + 1}. {getSectorName(sector._id + '0000')}
                            </span>
                            <Badge variant="outline">{formatCurrency(sector.total_savings)}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Projections */}
                <Card>
                  <CardHeader>
                    <CardTitle>Projections ZLECAf</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-blue-600">Horizon 2025</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Augmentation volume commercial:</span>
                            <Badge variant="secondary">{statistics.projections['2025'].trade_volume_increase}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Éliminations tarifaires:</span>
                            <Badge variant="outline">{statistics.projections['2025'].tariff_eliminations}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Nouveaux corridors commerciaux:</span>
                            <Badge variant="default">{statistics.projections['2025'].new_trade_corridors}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 text-green-600">Horizon 2030</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Augmentation volume commercial:</span>
                            <Badge variant="secondary">{statistics.projections['2030'].trade_volume_increase}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Augmentation PIB:</span>
                            <Badge variant="outline">{statistics.projections['2030'].gdp_increase}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Boost industrialisation:</span>
                            <Badge variant="default">{statistics.projections['2030'].industrialization_boost}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sources de données */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sources de Données Officielles</CardTitle>
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
                          {country.name} - {country.region}
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
                        <span>🏛️</span>
                        <span>{countryProfile.country_name}</span>
                      </CardTitle>
                      <CardDescription>
                        {countryProfile.region} • Population: {formatNumber(countryProfile.population)} habitants
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {countryProfile.gdp_usd && (
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                              ${(countryProfile.gdp_usd / 1000000000).toFixed(1)}B
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
                        
                        {countryProfile.inflation_rate && (
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-600">
                              {countryProfile.inflation_rate.toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-600">Taux d'inflation</p>
                          </div>
                        )}
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
                          <h4 className="font-semibold mb-3">Indicateurs Économiques</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Croissance PIB prévue 2024:</span>
                              <Badge variant="secondary">{countryProfile.projections.gdp_growth_forecast_2024}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Croissance démographique:</span>
                              <Badge variant="outline">{countryProfile.projections.population_growth_rate}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Potentiel commercial:</span>
                              <Badge variant="default">{countryProfile.projections.trade_growth_potential}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Environnement des Affaires</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Climat d'investissement:</span>
                              <Badge variant="secondary">{countryProfile.projections.investment_climate_score}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Indice infrastructure:</span>
                              <Badge variant="outline">{countryProfile.projections.infrastructure_index}/10</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Rang environnement business:</span>
                              <Badge variant="default">#{countryProfile.projections.business_environment_rank}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div>
                        <h4 className="font-semibold mb-3">Secteurs Clés</h4>
                        <div className="flex flex-wrap gap-2">
                          {countryProfile.projections.key_sectors.map((sector, index) => (
                            <Badge key={index} variant="outline">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg mt-4">
                        <h4 className="font-semibold text-green-800 mb-2">Potentiel ZLECAf</h4>
                        <p className="text-sm text-green-700">
                          <strong>Bénéfice potentiel:</strong> {countryProfile.projections.zlecaf_benefit_potential}
                        </p>
                        <p className="text-sm text-green-700">
                          Ce pays présente un fort potentiel de bénéfices avec la mise en œuvre complète de la ZLECAf.
                        </p>
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