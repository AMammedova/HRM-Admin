'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/shared/atoms/Card';
import { Button } from '@/shared/atoms/Button';
import { ExplanationFormModal } from '../components/ExplanationFormModal';

export interface ExplanationsContainerProps {
  locale: string;
}

export function ExplanationsContainer({ locale }: ExplanationsContainerProps) {
  const t = useTranslations('explanations');
  const tCommon = useTranslations('common');

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button onClick={handleCreate}>
          {t('addExplanation')}
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          {t('placeholder')}
        </CardContent>
      </Card>

      <ExplanationFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}


