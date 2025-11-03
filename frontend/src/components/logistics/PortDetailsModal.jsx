import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';

export default function PortDetailsModal({ isOpen, onClose, port }) {
  if (!port) return null;

  const agents = port.agents || [];
  const services = port.services || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <span>🚢</span>
            <span>{port.port_name}</span>
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{port.country_name}</Badge>
              <Badge variant="secondary">{port.port_type}</Badge>
              {port.un_locode && <Badge>{port.un_locode}</Badge>}
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Statistiques Principales */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <p className="text-xs text-blue-700 font-semibold">Conteneurs (TEU)</p>
            <p className="text-xl font-bold text-blue-600">
              {port.latest_stats?.container_throughput_teu?.toLocaleString('fr-FR') || 'N/A'}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <p className="text-xs text-green-700 font-semibold">Tonnage (tonnes)</p>
            <p className="text-xl font-bold text-green-600">
              {port.latest_stats?.cargo_throughput_tons?.toLocaleString('fr-FR') || 'N/A'}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <p className="text-xs text-purple-700 font-semibold">Escales/an</p>
            <p className="text-xl font-bold text-purple-600">
              {port.latest_stats?.vessel_calls?.toLocaleString('fr-FR') || 'N/A'}
            </p>
          </div>
        </div>

        {/* Tabs pour Agents et Services */}
        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="agents">
              👥 Agents Maritimes ({agents.length})
            </TabsTrigger>
            <TabsTrigger value="services">
              🚢 Lignes Régulières ({services.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="mt-4">
            {agents.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {agents.map((agent, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <div>
                        <p className="font-bold text-gray-900">{agent.agent_name}</p>
                        {agent.group && (
                          <p className="text-sm text-gray-600">
                            <Badge variant="outline" className="text-xs">
                              {agent.group}
                            </Badge>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                <p>Aucun agent maritime répertorié pour ce port.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="mt-4">
            {services.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-blue-900 flex items-center gap-2">
                          <span>🚢</span>
                          <span>{service.carrier} - {service.service_name}</span>
                        </p>
                        {service.frequency && (
                          <p className="text-sm text-gray-700 mt-1">
                            <span className="font-semibold">Fréquence:</span> {service.frequency}
                          </p>
                        )}
                        {service.rotation && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-semibold">Rotation:</span> {service.rotation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                <p>Aucune ligne régulière répertoriée pour ce port.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Coordonnées GPS */}
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p className="text-xs font-semibold text-gray-700">📍 Coordonnées GPS</p>
          <p className="text-sm text-gray-900 mt-1">
            Latitude: {port.geo_lat}° • Longitude: {port.geo_lon}°
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
