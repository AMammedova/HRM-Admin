'use client';

import * as React from 'react';
import { Department } from '../types/structure.types';
import { cn } from '@/shared/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface OrgChartNodeProps {
  department: Department;
  level?: number;
  employeeMap: Map<string, { name: string; position: string }>;
}

function OrgChartNode({ department, level = 0, employeeMap }: OrgChartNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(level < 2);
  const hasChildren = department.children && department.children.length > 0;
  const employee = employeeMap.get(department.id);

  return (
    <div className="flex flex-col">
      {/* Current Node */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'relative rounded-lg border-2 p-4 shadow-md transition-all hover:shadow-lg',
            level === 0
              ? 'bg-red-500 text-white border-red-600 min-w-[200px]'
              : level === 1
              ? 'bg-red-400 text-white border-red-500 min-w-[180px]'
              : level === 2
              ? 'bg-red-300 text-white border-red-400 min-w-[160px]'
              : 'bg-red-200 text-gray-800 border-red-300 min-w-[140px]'
          )}
        >
          <div className="text-center">
            <div className="font-bold text-sm mb-1">{department.name}</div>
            {employee && (
              <div className={cn('text-xs', level < 3 ? 'text-white/90' : 'text-gray-700')}>
                {employee.name}
              </div>
            )}
          </div>

          {/* Toggle Button */}
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                'absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full p-1',
                'border-2 shadow-sm transition-all hover:scale-110',
                level < 3
                  ? 'bg-red-500 border-red-600 text-white'
                  : 'bg-red-200 border-red-300 text-gray-800'
              )}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
        </div>

        {/* Vertical Connector */}
        {hasChildren && isExpanded && (
          <div className="w-0.5 h-8 bg-gray-300"></div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col items-center">
          {/* Horizontal Line */}
          <div className="relative flex w-full">
            <div className="absolute left-1/2 w-0.5 h-4 -top-4 bg-gray-300"></div>
            {department.children!.length > 1 && (
              <div className="absolute left-0 right-0 top-0 h-0.5 bg-gray-300"></div>
            )}
          </div>

          {/* Child Nodes */}
          <div className="flex flex-wrap gap-8 justify-center mt-4">
            {department.children!.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-gray-300"></div>
                <OrgChartNode
                  department={child}
                  level={level + 1}
                  employeeMap={employeeMap}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface OrgChartProps {
  departments: Department[];
  employees: { id: string; name: string; position: string; departmentId: string }[];
  className?: string;
}

export function OrgChart({ departments, employees, className }: OrgChartProps) {
  // Create a map for quick employee lookup
  const employeeMap = React.useMemo(() => {
    const map = new Map<string, { name: string; position: string }>();
    employees.forEach((emp) => {
      map.set(emp.departmentId, { name: emp.name, position: emp.position });
    });
    return map;
  }, [employees]);

  const rootDepartment = departments.find((d) => !d.parentDepartmentId);

  if (!rootDepartment) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        Struktur məlumatı tapılmadı
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="inline-block min-w-full p-8">
        <OrgChartNode department={rootDepartment} employeeMap={employeeMap} />
      </div>
    </div>
  );
}

