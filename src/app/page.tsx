'use client';

import React, { useEffect, useState } from 'react';
import BubbleApiService, { BubbleEmployee } from './services/bubbleApi';
import { OrgChartDataTransformer, OrgChartNode } from './utils/orgChartDataTransformer';
import OrgChartComponent from './components/OrgChart';

export default function Home() {
  const [orgChartData, setOrgChartData] = useState<OrgChartNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrgChart = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Configuración de Bubble usando variables NEXT_PUBLIC_
        const bubbleService = new BubbleApiService({
          apiKey: process.env.NEXT_PUBLIC_BUBBLE_API_KEY || '',
          appId: process.env.NEXT_PUBLIC_BUBBLE_APP_ID || '',
          baseUrl: process.env.NEXT_PUBLIC_BUBBLE_BASE_URL || ''
        });

        // Verificar que las variables de entorno estén configuradas
        if (!process.env.NEXT_PUBLIC_BUBBLE_API_KEY || !process.env.NEXT_PUBLIC_BUBBLE_APP_ID) {
          console.error('Variables de entorno faltantes:', {
            apiKey: process.env.NEXT_PUBLIC_BUBBLE_API_KEY ? 'Configurada' : 'Faltante',
            appId: process.env.NEXT_PUBLIC_BUBBLE_APP_ID ? 'Configurada' : 'Faltante',
            baseUrl: process.env.NEXT_PUBLIC_BUBBLE_BASE_URL ? 'Configurada' : 'Faltante'
          });
          setError('Variables de entorno de Bubble no configuradas');
          setIsLoading(false);
          return;
        }

        console.log('Variables de entorno configuradas correctamente');

        // Obtener empleados
        const employees: BubbleEmployee[] = await bubbleService.fetchEmployees();
        
        if (employees.length === 0) {
          setError('No se encontraron empleados');
          setIsLoading(false);
          return;
        }

        // Fetch Seniority and Position names
        const seniorityIds = [...new Set(employees.map(emp => emp.Seniority).filter(Boolean))];
        const positionIds = [...new Set(employees.map(emp => emp.Position).filter(Boolean))];
        const seniorityNames = new Map<string, string>();
        const seniorityAbbreviations = new Map<string, string>();
        const positionNames = new Map<string, string>();

        for (const seniorityId of seniorityIds) {
          try {
            const seniority = await bubbleService.fetchSeniorityById(seniorityId!);
            if (seniority && seniority.name) {
              seniorityNames.set(seniorityId!, seniority.name);
            }
            if (seniority && seniority["Seniority Abreviation"]) {
              seniorityAbbreviations.set(seniorityId!, seniority["Seniority Abreviation"]);
            }
          } catch (error) {
            seniorityNames.set(seniorityId!, `Seniority ${seniorityId}`);
            seniorityAbbreviations.set(seniorityId!, `S${seniorityId}`);
          }
        }
        for (const positionId of positionIds) {
          try {
            const position = await bubbleService.fetchPositionById(positionId!);
            if (position && position.name) {
              positionNames.set(positionId!, position.name);
            }
          } catch (error) {
            positionNames.set(positionId!, `Position ${positionId}`);
          }
        }

        const transformer = new OrgChartDataTransformer(employees, seniorityNames, seniorityAbbreviations, positionNames);
        const chartData = transformer.transformToOrgChartData();
        
        if (!chartData) {
          setError('No se pudo generar el organigrama');
          setIsLoading(false);
          return;
        }

        setOrgChartData(chartData);
        setIsLoading(false);

      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setIsLoading(false);
      }
    };

    loadOrgChart();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-600 text-center">
          <p className="font-bold">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!orgChartData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Organigrama Jedi Padawan
        </h1>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <OrgChartComponent data={orgChartData} />
        </div>
      </div>
    </div>
  );
}
