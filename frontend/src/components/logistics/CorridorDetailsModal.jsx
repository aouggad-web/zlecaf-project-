import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return new Intl.NumberFormat('fr-FR').format(num);
};

const getTypeIcon = (type) => {
  if (type === 'road') return '🛣️';
  if (type === 'rail') return '🚂';
  if (type === 'multimodal') return '🚛🚂';
  return '🛤️';
};

const getNodeTypeIcon = (type) => {
  if (type === 'border_crossing') return '🚧';
  if (type === 'dry_port') return '📦';
  if (type === 'rail_terminal') return '🚂';
  if (type === 'intermodal_hub') return '🔀';
  return '📍';
};

export default function CorridorDetailsModal({ corridor, open, onClose }) {
  if (!corridor) return null;

  const stats = corridor.stats || {};
  const nodes = corridor.nodes || [];
  const operators = corridor.operators || [];
  const osbpNodes = nodes.filter(n => n.is_osbp);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>{getTypeIcon(corridor.corridor_type)}</span>
            {corridor.corridor_name}
          </DialogTitle>
          <DialogDescription className="flex gap-2 mt-2 flex-wrap">
            <Badge className="bg-slate-700">{corridor.corridor_type}</Badge>
            <Badge variant="outline">{corridor.status}</Badge>
            {corridor.importance === 'high' && <Badge className="bg-amber-500">⭐ Prioritaire PIDA</Badge>}
            <Badge variant="outline">{corridor.length_km} km</Badge>
          </DialogDescription>
        </DialogHeader>

        {/* Description */}
        {corridor.description && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
            <p className="text-sm text-gray-800">
              <span className="font-semibold">📋 Description: </span>
              {corridor.description}
            </p>
          </div>
        )}

        {/* KPI Cards Section */}
        {stats.freight_throughput_tons && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-4">
                <p className="text-xs font-semibold text-blue-700 mb-1">📦 Fret Annuel</p>
                <p className="text-2xl font-bold text-blue-900">{formatNumber(stats.freight_throughput_tons)}</p>
                <p className="text-xs text-gray-600">tonnes ({stats.year || 2024})</p>
              </CardContent>
            </Card>

            {stats.avg_transit_time_hours && (
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-4">
                  <p className="text-xs font-semibold text-green-700 mb-1">⏱️ Temps Transit</p>
                  <p className="text-2xl font-bold text-green-900">{stats.avg_transit_time_hours}</p>
                  <p className="text-xs text-gray-600">heures</p>
                </CardContent>
              </Card>
            )}

            {stats.avg_border_crossing_time_hours && (
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="pt-4">
                  <p className="text-xs font-semibold text-orange-700 mb-1">🚧 Temps Frontière</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.avg_border_crossing_time_hours}</p>
                  <p className="text-xs text-gray-600">heures</p>
                </CardContent>
              </Card>
            )}

            {stats.truck_volumes_daily && (
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="pt-4">
                  <p className="text-xs font-semibold text-purple-700 mb-1">🚛 Trafic Quotidien</p>
                  <p className="text-2xl font-bold text-purple-900">{formatNumber(stats.truck_volumes_daily)}</p>
                  <p className="text-xs text-gray-600">camions/jour</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Infrastructure Section */}
        <Card className="mb-4">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>🔧</span>
              Infrastructure & Tracé
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Pays traversés:</p>
                <p className="text-base">{corridor.countries_spanned?.join(' → ')}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Points de départ/arrivée:</p>
                <p className="text-base">{corridor.start_node} → {corridor.end_node}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-1">Détails techniques:</p>
                <p className="text-sm text-gray-800">{corridor.infra_details}</p>
              </div>
              {stats.source_org && (
                <div className="text-xs text-gray-600">
                  <span className="font-semibold">Source: </span>
                  {stats.source_org}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Nodes, Operators */}
        <Tabs defaultValue="nodes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nodes">🚧 Nœuds Logistiques ({nodes.length})</TabsTrigger>
            <TabsTrigger value="operators">🚛 Opérateurs ({operators.length})</TabsTrigger>
          </TabsList>

          {/* Nodes Tab */}
          <TabsContent value="nodes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nœuds Logistiques & Postes-Frontières</CardTitle>
                {osbpNodes.length > 0 && (
                  <p className="text-sm text-green-600 font-semibold">✓ {osbpNodes.length} OSBP (One-Stop Border Post) opérationnel(s)</p>
                )}
              </CardHeader>
              <CardContent>
                {nodes.length > 0 ? (
                  <div className="space-y-3">
                    {nodes.map((node, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-lg border-l-4 ${
                          node.is_osbp 
                            ? 'bg-green-50 border-green-500' 
                            : node.node_type === 'border_crossing'
                            ? 'bg-orange-50 border-orange-500'
                            : 'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-base flex items-center gap-2">
                              <span>{getNodeTypeIcon(node.node_type)}</span>
                              {node.node_name}
                              {node.is_osbp && <Badge className="bg-green-600 text-white text-xs">OSBP</Badge>}
                            </p>
                            <p className="text-sm text-gray-600">{node.country_iso} • {node.node_type}</p>
                            {node.notes && (
                              <p className="text-xs text-gray-700 mt-1">{node.notes}</p>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {node.geo_lat?.toFixed(3)}, {node.geo_lon?.toFixed(3)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucun nœud enregistré</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operators Tab */}
          <TabsContent value="operators" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Opérateurs de Transport</CardTitle>
              </CardHeader>
              <CardContent>
                {operators.length > 0 ? (
                  <div className="space-y-3">
                    {operators.map((operator, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-lg ${
                          operator.operator_type === 'rail_operator'
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-blue-50 border border-blue-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-base">
                              {operator.operator_type === 'rail_operator' ? '🚂' : '🚛'} {operator.operator_name}
                            </p>
                            <p className="text-sm text-gray-600">{operator.group}</p>
                            <p className="text-xs text-gray-500 mt-1">{operator.country_iso}</p>
                          </div>
                          {operator.fleet_size > 0 && (
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">{operator.fleet_size}</p>
                              <p className="text-xs text-gray-600">
                                {operator.operator_type === 'rail_operator' ? 'locomotives' : 'camions'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucun opérateur enregistré</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Source information */}
        <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded">
          <span className="font-semibold">Source: </span>
          {corridor.source_org}
        </div>
      </DialogContent>
    </Dialog>
  );
}
