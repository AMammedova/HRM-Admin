'use client';

import * as React from 'react';
import { mockOrganizationStructure } from '../data/mock-structure';
import { OrgChart } from '../presenters/OrgChart';
import { OrgTreeView } from '../presenters/OrgTreeView';
import { Card, CardContent } from '@/shared/atoms/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/atoms/Tabs';
import { Input } from '@/shared/atoms/Input';
import { Search } from 'lucide-react';

export function StructureContainer() {
  const [selectedDepartmentId, setSelectedDepartmentId] = React.useState<string>();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [view, setView] = React.useState<'chart' | 'tree'>('chart');

  const { departments, employees } = mockOrganizationStructure;

  // Filter departments and employees based on search
  const filteredData = React.useMemo(() => {
    if (!searchQuery) {
      return { departments, employees };
    }

    const query = searchQuery.toLowerCase();
    const filteredEmployees = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query)
    );

    const matchingDepartmentIds = new Set(
      filteredEmployees.map((emp) => emp.departmentId)
    );

    const filteredDepartments = departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(query) ||
        matchingDepartmentIds.has(dept.id)
    );

    return { departments: filteredDepartments, employees: filteredEmployees };
  }, [searchQuery, departments, employees]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Axtarış (şöbə, işçi, vəzifə...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-4">
          <CardContent className="p-6">
            <Tabs value={view} onValueChange={(v) => setView(v as 'chart' | 'tree')}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Təşkilat Strukturu</h3>
                <TabsList>
                  <TabsTrigger value="chart">Qrafik</TabsTrigger>
                  <TabsTrigger value="tree">Ağac</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="chart" className="m-0">
                <div className="border rounded-lg bg-gray-50 dark:bg-gray-900">
                  <OrgChart
                    departments={filteredData.departments}
                    employees={filteredData.employees}
                  />
                </div>
              </TabsContent>

              <TabsContent value="tree" className="m-0">
                <div className="border rounded-lg p-4 bg-background">
                  <OrgTreeView
                    departments={filteredData.departments}
                    employees={filteredData.employees}
                    selectedId={selectedDepartmentId}
                    onSelect={setSelectedDepartmentId}
                    className="max-h-[600px]"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

