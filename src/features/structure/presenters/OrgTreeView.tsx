'use client';

import * as React from 'react';
import { Department } from '../types/structure.types';
import { cn } from '@/shared/lib/utils';
import { ChevronDown, ChevronRight, Building2, Users } from 'lucide-react';

interface OrgTreeNodeProps {
  department: Department;
  level?: number;
  employeeMap: Map<string, { name: string; position: string }>;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

function OrgTreeNode({ 
  department, 
  level = 0, 
  employeeMap,
  selectedId,
  onSelect 
}: OrgTreeNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(level < 2);
  const hasChildren = department.children && department.children.length > 0;
  const employee = employeeMap.get(department.id);
  const isSelected = selectedId === department.id;

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors',
          'hover:bg-accent',
          isSelected && 'bg-accent'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect?.(department.id)}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="flex-shrink-0 hover:bg-accent-foreground/10 rounded p-0.5"
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>

        {/* Icon */}
        {level === 0 ? (
          <Building2 className="h-4 w-4 text-red-500 flex-shrink-0" />
        ) : (
          <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{department.name}</div>
          {employee && (
            <div className="text-xs text-muted-foreground truncate">
              {employee.name}
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {department.children!.map((child) => (
            <OrgTreeNode
              key={child.id}
              department={child}
              level={level + 1}
              employeeMap={employeeMap}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface OrgTreeViewProps {
  departments: Department[];
  employees: { id: string; name: string; position: string; departmentId: string }[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function OrgTreeView({ 
  departments, 
  employees, 
  selectedId,
  onSelect,
  className 
}: OrgTreeViewProps) {
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
    <div className={cn('w-full h-full overflow-y-auto', className)}>
      <OrgTreeNode 
        department={rootDepartment} 
        employeeMap={employeeMap}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </div>
  );
}

