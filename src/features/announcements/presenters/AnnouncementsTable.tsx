'use client';

import * as React from 'react';
import { MoreVertical, ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { Button } from '@/shared/atoms/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/atoms/DropdownMenu';
import { Announcement } from '../types/announcement.types';
import { cn, truncate } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

export interface AnnouncementsTableProps {
  announcements: Announcement[];
  selectedIds: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onView?: (announcement: Announcement) => void;
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (announcement: Announcement) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
}

export function AnnouncementsTable({
  announcements,
  selectedIds,
  onSelect,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  onSort,
  loading = false,
}: AnnouncementsTableProps) {
  const t = useTranslations('announcements');
  const tCommon = useTranslations('common');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const allSelected =
    announcements.length > 0 && announcements.every((a) => selectedIds.has(String(a.id)));

  const handleSort = (key: string) => {
    if (!onSort) return;
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
    onSort(key, newDirection);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">{tCommon('loading')}</div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">{t('noAnnouncements')}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50">
            {/* Title + checkbox */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  aria-label="Select all"
                />
                <span
                  className={cn('cursor-pointer select-none', onSort && 'flex items-center gap-1')}
                  onClick={() => onSort && handleSort('title')}
                >
                  {t('titleColumn')}
                  {onSort && <ArrowUpDown className="h-3 w-3 inline-block ml-1" />}
                </span>
              </div>
            </th>

            {/* Date */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('date')}
            </th>

            {/* End date */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('endDate')}
            </th>

            {/* Content */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('content')}
            </th>

            {/* Actions */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {tCommon('actions')}
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {announcements.map((announcement) => {
            const isSelected = selectedIds.has(String(announcement.id));

            return (
              <tr
                key={announcement.id}
                className={cn(
                  'border-b transition-colors hover:bg-muted/50',
                  isSelected && 'bg-muted/30',
                )}
              >
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        onSelect(String(announcement.id), checked as boolean)
                      }
                      aria-label={`Select ${announcement.title}`}
                    />
                    <div className="font-medium">{announcement.title}</div>
                  </div>
                </td>

                <td className="p-4 align-middle">
                  <div className="text-sm">{announcement.date}</div>
                </td>

                <td className="p-4 align-middle">
                  <div className="text-sm">{announcement.endDate}</div>
                </td>

                <td className="p-4 align-middle">
                  <div className="text-sm text-muted-foreground max-w-xs truncate">
                    {truncate(announcement.content, 40)}
                  </div>
                </td>

                <td className="p-4 align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(announcement)}>
                          {tCommon('view')}
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(announcement)}>
                          {tCommon('edit')}
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(announcement)}
                          className="text-destructive"
                        >
                          {tCommon('delete')}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


