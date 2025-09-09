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
  const [loading, setLoading] = useState(false);

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
      await fetchStatistics(); // Recharger les statistiques
      
      toast({
        title: "Calcul réussi",
        description: `Économie potentielle: ${response.data.savings.toFixed(2)} FCFA`,
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
                Calculateur de Bénéfices & Règles d'Origine
              </p>
              <Badge variant="outline" className="mt-2">
                Zone de Libre-Échange Continentale Africaine
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculateur</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulaire de calcul */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>📊</span>
                    <span>Calculer les Bénéfices</span>
                  </CardTitle>
                  <CardDescription>
                    Calculez les économies tarifaires grâce à la ZLECAf
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
                              {country.name}
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
                              {country.name}
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
                    <p className="text-sm text-gray-500">
                      Code de classification harmonisée des marchandises
                    </p>
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
                    {loading ? 'Calcul en cours...' : 'Calculer'}
                  </Button>
                </CardContent>
              </Card>

              {/* Résultats */}
              {result && (
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-700">
                      <span>💰</span>
                      <span>Résultats du Calcul</span>
                    </CardTitle>
                    <CardDescription>
                      {getCountryName(result.origin_country)} → {getCountryName(result.destination_country)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Tarif normal</p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(result.tariff_amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(result.tariff_rate * 100).toFixed(1)}% de {formatCurrency(result.value)}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Tarif ZLECAf</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(result.zlecaf_amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(result.zlecaf_rate * 100).toFixed(1)}% de {formatCurrency(result.value)}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium text-gray-600">Économie réalisée</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {formatCurrency(result.savings)}
                      </p>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {result.savings_percentage.toFixed(1)}% d'économie
                      </Badge>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Code SH6:</strong> {result.hs_code}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Calcul effectué le {new Date(result.timestamp).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>📈</span>
                    <span>Calculs Totaux</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">
                    {statistics?.total_calculations || 0}
                  </p>
                  <p className="text-sm text-gray-600">calculs effectués</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>💰</span>
                    <span>Économies Totales</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {statistics ? formatCurrency(statistics.total_savings) : '0 FCFA'}
                  </p>
                  <p className="text-sm text-gray-600">économisées par la ZLECAf</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>🌍</span>
                    <span>Impact ZLECAf</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-purple-600">54 Pays</p>
                  <p className="text-sm text-gray-600">membres actifs</p>
                </CardContent>
              </Card>
            </div>

            {statistics && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pays les plus actifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {statistics.most_traded_countries.map((country, index) => (
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
                    <CardTitle>Codes SH6 populaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {statistics.popular_hs_codes.map((hs, index) => (
                        <div key={hs._id} className="flex justify-between items-center">
                          <span className="text-sm font-mono">
                            {index + 1}. {hs._id}
                          </span>
                          <Badge variant="outline">{hs.count} utilisations</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
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