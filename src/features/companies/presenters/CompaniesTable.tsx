'use client';

import * as React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { CompanyListItem } from '../types/company.types';
import { useTranslations } from 'next-intl';

export interface CompaniesTableProps {
  companies: CompanyListItem[];
  loading?: boolean;
  locale: string;
  togglingId?: number | null;
  onEdit: (company: CompanyListItem) => void;
  onDelete: (company: CompanyListItem) => void;
  onView: (company: CompanyListItem) => void;
  onToggleStatus: (company: CompanyListItem) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

export function CompaniesTable({
  companies,
  loading = false,
  togglingId = null,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
  onSort,
}: CompaniesTableProps) {
  const t = useTranslations('companies');
  const tCommon = useTranslations('common');

  const columns: Column<CompanyListItem>[] = [
    {
      key: 'compCode',
      header: t('compCode'),
      sortable: true,
      render: (company) => <div className="font-medium">{company.compCode}</div>,
    },
    {
      key: 'name',
      header: t('name'),
      sortable: true,
    },
    {
      key: 'email',
      header: t('email'),
      sortable: true,
      render: (company) => (
        <div className="text-sm text-muted-foreground">{company.email}</div>
      ),
    },
    {
      key: 'taxId',
      header: t('taxId'),
    },
    {
      key: 'companyTypeName',
      header: t('companyType'),
    },
    {
      key: 'isActive',
      header: t('status'),
      render: (company) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={company.isActive}
            disabled={togglingId === company.id}
            onCheckedChange={() => onToggleStatus(company)}
            aria-label={company.isActive ? t('deactivate') : t('activate')}
          />
          <Badge variant={company.isActive ? 'success' : 'secondary'}>
            {company.isActive ? t('active') : t('inactive')}
          </Badge>
        </div>
      ),
    },
    {
      key: 'actions',
      header: tCommon('actions'),
      render: (company) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(company)}
            aria-label={`${tCommon('view')} ${company.name}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(company)}
            aria-label={`${tCommon('edit')} ${company.name}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(company)}
            aria-label={`${tCommon('delete')} ${company.name}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={companies}
      columns={columns}
      loading={loading}
      onSort={onSort}
      emptyMessage={t('noCompanies')}
    />
  );
}
