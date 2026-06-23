'use client';

import * as React from 'react';
import { ChevronRight, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/shared/atoms/Badge';
import { cn } from '@/shared/lib/utils';
import { OrgChartLevelTreeNode } from '../types/org-chart-level.types';

interface TreeNodeProps {
  node: OrgChartLevelTreeNode;
  depth?: number;
}

function TreeNode({ node, depth = 0 }: TreeNodeProps) {
  const [expanded, setExpanded] = React.useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
          depth === 0 && 'font-semibold'
        )}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        {/* Expand/collapse toggle */}
        <button
          type="button"
          onClick={() => hasChildren && setExpanded((v) => !v)}
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors',
            hasChildren ? 'hover:text-foreground cursor-pointer' : 'cursor-default opacity-0'
          )}
        >
          {hasChildren &&
            (expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            ))}
        </button>

        {/* Level badge */}
        <Badge variant="secondary" className="text-xs tabular-nums w-6 justify-center shrink-0">
          {node.levelNo}
        </Badge>

        {/* Name */}
        <span className={cn('flex-1', !node.name && 'italic text-muted-foreground')}>
          {node.name || '—'}
        </span>

        {/* Code */}
        <span className="font-mono text-xs text-muted-foreground">{node.code}</span>

        {/* Visibility */}
        {node.isVisible ? (
          <Eye className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
        ) : (
          <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div
          className="border-l border-border ml-[30px]"
          style={{ marginLeft: `${depth * 20 + 30}px` }}
        >
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export interface OrgChartLevelTreeViewProps {
  tree: OrgChartLevelTreeNode[];
  loading?: boolean;
}

export function OrgChartLevelTreeView({ tree, loading = false }: OrgChartLevelTreeViewProps) {
  const t = useTranslations('orgChartLevels');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
        {t('loadingTree')}
      </div>
    );
  }

  if (!tree.length) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
        {t('noTreeData')}
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-3 py-2 text-xs font-medium text-muted-foreground">
        <span className="w-5" />
        <span className="w-6 text-center">#</span>
        <span className="flex-1">{t('name')}</span>
        <span className="font-mono">{t('code')}</span>
        <span className="w-4" />
      </div>

      <div className="divide-y divide-border/50">
        {tree.map((node) => (
          <TreeNode key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}
