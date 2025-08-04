'use client';

import React from 'react';

interface Employee {
  id: string;
  name: string;
  email?: string;
  position?: string;
  seniority?: string;
  level?: number;
  color?: string;
  children?: Employee[];
  jediMentor?: string;
  active?: boolean;
  salary?: number;
  legajo?: number;
  [key: string]: unknown;
}

interface OrgChartProps {
  data: Employee;
}

const OrgChartComponent: React.FC<OrgChartProps> = ({ data }) => {
  const renderNode = (node: Employee) => {
    return (
      <div key={node.id} className="flex flex-col items-center">
        <div
          className="bg-white border-2 rounded-lg p-2 shadow-md min-w-32 text-center"
          style={{ borderColor: node.color || '#4CAF50' }}
        >
          <div className="font-bold text-xs text-[#01164D] mb-1 leading-tight">{node.name}</div>
          {node.position && (
            <div className="text-xs text-[#01164D] mb-1 leading-tight">{node.position}</div>
          )}
          {node.seniority && (
            <div className="text-xs text-[#01164D] leading-tight">{node.seniority}</div>
          )}
        </div>
        {node.children && node.children.length > 0 && (
          <div className="mt-3">
            {/* Línea vertical desde el Jedi hasta el nivel de los Padawans */}
            <div className="w-px h-3 bg-gray-300 mx-auto mb-3"></div>
            
            {/* Contenedor de Padawans con líneas horizontales */}
            <div className="flex flex-wrap gap-3 justify-center relative max-w-full">
              {node.children.map((child, index) => (
                <div key={child.id} className="flex flex-col items-center relative">
                  {/* Línea horizontal desde el centro hasta cada Padawan */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gray-300"></div>
                  
                  {/* Línea vertical desde la línea horizontal hasta el Padawan */}
                  <div className="w-px h-3 bg-gray-300 mx-auto mb-3"></div>
                  
                  {renderNode(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="p-4 min-h-screen font-['Inter'] text-xs">
        {renderNode(data)}
      </div>
    </div>
  );
};

export default OrgChartComponent; 