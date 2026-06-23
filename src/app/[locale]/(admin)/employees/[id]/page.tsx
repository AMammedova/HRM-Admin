'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Breadcrumb } from '@/shared/molecules/Breadcrumb';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Button } from '@/shared/atoms/Button';
import { Card, CardContent } from '@/shared/atoms/Card';
import { Avatar, AvatarFallback } from '@/shared/atoms/Avatar';
import { Badge } from '@/shared/atoms/Badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/atoms/Accordion';
import { employeesApi } from '@/features/employees/api/employees.api';
import {
  formatEmployeeDate,
  getEmployeeTranslation,
  getInitialsFromFullName,
} from '@/features/employees/types/employee.types';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { ArrowLeft, User, Briefcase, Languages } from 'lucide-react';
import Link from 'next/link';

function BoolValue({
  value,
  yesLabel,
  noLabel,
}: {
  value: boolean;
  yesLabel: string;
  noLabel: string;
}) {
  return <span>{value ? yesLabel : noLabel}</span>;
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const id = Number(params.id);

  const t = useTranslations('employees');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const companyId = useCompanyId();

  const { data: employee, isLoading, isError } = useQuery({
    queryKey: ['company-employee', companyId, id],
    queryFn: () => employeesApi.getById(companyId!, id),
    enabled: !!companyId && !!id,
  });

  const translation = employee
    ? getEmployeeTranslation(employee.translations, locale)
    : undefined;

  const fullName = translation
    ? `${translation.surname} ${translation.name}`.trim()
    : '';

  const breadcrumbItems = [
    { label: tNav('dashboard'), href: `/${locale}/dashboard` },
    { label: tNav('employees'), href: `/${locale}/employees` },
    { label: t('employeeCard'), href: `/${locale}/employees` },
    { label: fullName || t('employeeDetails') },
  ];

  if (!companyId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {tCommon('noCompanyInSession')}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        {tCommon('loading')}
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center text-destructive">
        {t('loadError')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader
          title={fullName}
          action={
            <Link href={`/${locale}/employees`}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {tCommon('back')}
              </Button>
            </Link>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 lg:self-start">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitialsFromFullName(fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{fullName}</h2>
                {translation?.fatherName && (
                  <p className="text-muted-foreground mt-1">{translation.fatherName}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">{employee.code}</p>
                <div className="mt-3">
                  <Badge variant="outline">
                    {employee.gender ? t('male') : t('female')}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full" defaultValue="personal">
              <AccordionItem value="personal">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>{t('personalInfo')}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <DetailField label={t('employeeCode')} value={employee.code} />
                    <DetailField label={t('fin')} value={employee.socialCardNum} />
                    <DetailField label={t('birthDate')} value={formatEmployeeDate(employee.birthDate)} />
                    <DetailField label={t('birthPlace')} value={employee.birthPlace} />
                    <DetailField label={t('citizenship')} value={employee.citizenship} />
                    <DetailField
                      label={t('gender')}
                      value={employee.gender ? t('male') : t('female')}
                    />
                    <DetailField
                      label={t('bloodGroupLookupValueId')}
                      value={String(employee.bloodGroupLookupValueId)}
                    />
                    <DetailField label={t('academicDegree')} value={employee.academicDegree} />
                    <DetailField label={t('militaryCardNum')} value={employee.militaryCardNum} />
                    <DetailField
                      label={t('isMarried')}
                      value={
                        <BoolValue
                          value={employee.isMarried}
                          yesLabel={tCommon('yes')}
                          noLabel={tCommon('no')}
                        />
                      }
                    />
                    <DetailField
                      label={t('hasDriverLicense')}
                      value={
                        <BoolValue
                          value={employee.hasDriverLicense}
                          yesLabel={tCommon('yes')}
                          noLabel={tCommon('no')}
                        />
                      }
                    />
                    <DetailField
                      label={t('hasMilitaryService')}
                      value={
                        <BoolValue
                          value={employee.hasMilitaryService}
                          yesLabel={tCommon('yes')}
                          noLabel={tCommon('no')}
                        />
                      }
                    />
                    <DetailField
                      label={t('isForeignNational')}
                      value={
                        <BoolValue
                          value={employee.isForeignNational}
                          yesLabel={tCommon('yes')}
                          noLabel={tCommon('no')}
                        />
                      }
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="work">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    <span>{t('workInfo')}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <DetailField
                      label={t('isTaxCalculated')}
                      value={
                        <BoolValue
                          value={employee.isTaxCalculated}
                          yesLabel={tCommon('yes')}
                          noLabel={tCommon('no')}
                        />
                      }
                    />
                    <DetailField
                      label={t('maxDeductionPercent')}
                      value={`${employee.maxDeductionPercent}%`}
                    />
                    <DetailField
                      label={t('autoCalcOvertime')}
                      value={
                        <BoolValue
                          value={employee.autoCalcOvertime}
                          yesLabel={tCommon('yes')}
                          noLabel={tCommon('no')}
                        />
                      }
                    />
                    <DetailField
                      label={t('vacationPercent')}
                      value={`${employee.vacationPercent}%`}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="translations">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    <span>{t('translations')}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-muted-foreground">
                          <th className="pb-2 pr-4 font-medium">{t('language')}</th>
                          <th className="pb-2 pr-4 font-medium">{t('surname')}</th>
                          <th className="pb-2 pr-4 font-medium">{t('firstName')}</th>
                          <th className="pb-2 font-medium">{t('fatherName')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employee.translations.map((tr) => (
                          <tr key={tr.languageCode} className="border-b last:border-0">
                            <td className="py-3 pr-4 font-medium">
                              {t(`lang.${tr.languageCode}`)}
                            </td>
                            <td className="py-3 pr-4">{tr.surname}</td>
                            <td className="py-3 pr-4">{tr.name}</td>
                            <td className="py-3">{tr.fatherName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <p className="mt-1 text-sm font-medium">{value || '—'}</p>
    </div>
  );
}
