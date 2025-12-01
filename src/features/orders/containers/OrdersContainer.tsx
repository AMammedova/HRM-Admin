'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/shared/atoms/Card';
import { Button } from '@/shared/atoms/Button';
import { Pagination } from '@/shared/molecules/Pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/atoms/Select';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { OrdersTable } from '../presenters/OrdersTable';
import { mockOrders } from '../data/mock-orders';
import { Order } from '../types/order.types';

export interface OrdersContainerProps {
  locale: string;
}

export function OrdersContainer({ locale }: OrdersContainerProps) {
  const t = useTranslations('orders');
  const tCommon = useTranslations('common');

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const totalPages = Math.ceil(mockOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = mockOrders.slice(startIndex, endIndex);

  const handleSelect = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedIds);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(paginatedOrders.map((o) => String(o.id))));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    // TODO: Implement sorting
    console.log('Sorting orders by:', key, direction);
  };

  const handleView = (order: Order) => {
    console.log('View order', order.id);
  };

  const handleEdit = (order: Order) => {
    console.log('Edit order', order.id);
  };

  const handleDelete = (order: Order) => {
    console.log('Delete order', order.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds(new Set());
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  return (
    <>
      <div className="flex justify-end items-center mb-6">
        <Link
          href={`/${locale}/orders/create`}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('addOrder')}
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <OrdersTable
            orders={paginatedOrders}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSort={handleSort}
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t('itemsPerPage')}:</span>
          <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </>
  );
}


