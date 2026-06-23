'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/atoms/Dialog';
import { Button } from '@/shared/atoms/Button';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { Label } from '@/shared/atoms/Label';
import { Input } from '@/shared/atoms/Input';
import { FormField } from '@/shared/molecules/FormField';
import {
  companyPdfSignatureSchema,
  CompanyPdfSignatureFormData,
  fileToBase64,
} from '@/validators/company-pdf-signature.schema';
import { CompanyPdfSignature } from '../types/company-pdf-signature.types';

export interface CompanyPdfSignatureFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  signature?: CompanyPdfSignature | null;
  onSubmit: (data: CompanyPdfSignatureFormData & { content: string }) => void;
  loading?: boolean;
}

export function CompanyPdfSignatureFormModal({
  open,
  onOpenChange,
  companyId,
  signature,
  onSubmit,
  loading = false,
}: CompanyPdfSignatureFormModalProps) {
  const t = useTranslations('companyPdfSignatures');
  const tCommon = useTranslations('common');
  const isEdit = !!signature;
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [contentBase64, setContentBase64] = React.useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CompanyPdfSignatureFormData>({
    resolver: zodResolver(companyPdfSignatureSchema),
    defaultValues: {
      companyId,
      name: '',
      filePath: '',
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (open) {
      setFileError(null);
      setContentBase64(signature?.content ?? '');
      setPreviewUrl(
        signature?.content
          ? `data:image/png;base64,${signature.content}`
          : null
      );
      reset(
        signature
          ? {
              companyId: signature.companyId,
              name: signature.name,
              filePath: signature.filePath,
              isActive: signature.isActive,
              content: signature.content,
            }
          : {
              companyId,
              name: '',
              filePath: '',
              isActive: true,
              content: '',
            }
      );
    }
  }, [open, signature, companyId, reset]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError(t('invalidFileType'));
      return;
    }

    setFileError(null);
    const base64 = await fileToBase64(file);
    setContentBase64(base64);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFormSubmit = (data: CompanyPdfSignatureFormData) => {
    const content = contentBase64 || signature?.content || '';
    if (!content) {
      setFileError(t('fileRequired'));
      return;
    }
    onSubmit({ ...data, content });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('editSignature') : t('createSignature')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <input type="hidden" {...register('companyId', { valueAsNumber: true })} />

          <FormField
            label={t('name')}
            placeholder={t('namePlaceholder')}
            error={errors.name?.message}
            disabled={loading}
            {...register('name')}
          />

          <FormField
            label={t('filePath')}
            placeholder="/signatures/director.png"
            error={errors.filePath?.message}
            disabled={loading}
            {...register('filePath')}
          />

          <div className="space-y-2">
            <Label>{t('signatureFile')}</Label>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={handleFileChange}
            />
            {fileError && <p className="text-sm text-destructive">{fileError}</p>}
            {isEdit && !contentBase64 && !fileError && (
              <p className="text-sm text-muted-foreground">{t('keepExistingFile')}</p>
            )}
            {previewUrl && (
              <div className="mt-2 rounded-lg border p-2">
                <img
                  src={previewUrl}
                  alt={t('preview')}
                  className="mx-auto max-h-24 object-contain"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="pdfIsActive"
                  checked={field.value}
                  disabled={loading}
                  onCheckedChange={(value) => field.onChange(value === true)}
                />
              )}
            />
            <Label htmlFor="pdfIsActive" className="cursor-pointer">
              {t('active')}
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {tCommon('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? tCommon('loading') : tCommon('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
