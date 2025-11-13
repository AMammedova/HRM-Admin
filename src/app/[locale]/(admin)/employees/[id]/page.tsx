'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/shared/molecules/Breadcrumb';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Button } from '@/shared/atoms/Button';
import { Card, CardContent } from '@/shared/atoms/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/atoms/Avatar';
import { Badge } from '@/shared/atoms/Badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/atoms/Accordion';
import { mockEmployees } from '@/features/employees/data/mock-employees';
import { Edit, ArrowLeft, User, Mail, Phone, MapPin, Calendar, CreditCard, Briefcase, GraduationCap, History } from 'lucide-react';
import Link from 'next/link';

export default function EmployeeDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;
  
  const t = useTranslations('employees');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const employee = React.useMemo(() => {
    return mockEmployees.find((emp) => emp.id === id);
  }, [id]);

  if (!employee) {
    notFound();
  }

  const breadcrumbItems = [
    { label: tNav('dashboard'), href: `/${locale}/dashboard` },
    { label: tNav('employees'), href: `/${locale}/employees` },
    { label: t('employeeCard'), href: `/${locale}/employees` },
    { label: `${employee.firstName} ${employee.lastName}` },
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Mock detailed data
  const detailedEmployee = {
    ...employee,
    birthDate: '1990-05-15',
    address: 'Bakı şəhəri, Nəsimi rayonu, Mərdəkan qəsəbəsi',
    passportNumber: 'AZE123456',
    passportIssueDate: '2015-01-10',
    passportExpiryDate: '2025-01-10',
    workStartDate: '2020-03-01',
    contractType: 'Müddətli müqavilə',
    salary: 2500,
    bankAccount: 'AZ12NABZ00000000001234567890',
    emergencyContact: {
      name: 'Aygün Məmmədova',
      phone: '+994501234567',
      relation: 'Həyat yoldaşı',
    },
    education: [
      {
        institution: 'Bakı Dövlət Universiteti',
        degree: 'İnformatika və İdarəetmə',
        startDate: '2008-09-01',
        endDate: '2012-06-30',
      },
    ],
    workHistory: [
      {
        company: 'Tech Solutions MMC',
        position: 'Junior Developer',
        startDate: '2012-07-01',
        endDate: '2015-12-31',
      },
      {
        company: 'Digital Innovations',
        position: 'Middle Developer',
        startDate: '2016-01-01',
        endDate: '2020-02-29',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader
          title={`${employee.firstName} ${employee.lastName}`}
          action={
            <div className="flex items-center gap-2">
              <Link href={`/${locale}/employees`}>
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {tCommon('back')}
                </Button>
              </Link>
              <Link href={`/${locale}/employees/${id}/edit`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  {tCommon('edit')}
                </Button>
              </Link>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 lg:self-start">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(employee.firstName, employee.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">
                  {employee.firstName} {employee.lastName}
                </h2>
                <p className="text-muted-foreground mt-1">{employee.position}</p>
                <Badge variant={employee.status === 'active' ? 'success' : 'secondary'} className="mt-2">
                  {t(employee.status || 'active')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Accordion */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full" defaultValue="personal">
              {/* Şəxsi məlumatlar */}
              <AccordionItem value="personal">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>{t('personalInfo')}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('employeeCode')}</label>
                      <p className="mt-1 text-sm font-medium">{employee.code}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('fin')}</label>
                      <p className="mt-1 text-sm font-medium">{employee.fin}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('birthDate')}</label>
                      <p className="mt-1 text-sm font-medium">{detailedEmployee.birthDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('passportNumber')}</label>
                      <p className="mt-1 text-sm font-medium">{detailedEmployee.passportNumber}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t('address')}
                      </label>
                      <p className="mt-1 text-sm font-medium">{detailedEmployee.address}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Əlaqə məlumatları */}
              <AccordionItem value="contact">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    <span>{t('contactInfo')}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {employee.email && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {t('email')}
                        </label>
                        <p className="mt-1 text-sm font-medium">{employee.email}</p>
                      </div>
                    )}
                    {employee.phone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {t('phone')}
                        </label>
                        <p className="mt-1 text-sm font-medium">{employee.phone}</p>
                      </div>
                    )}
                    {detailedEmployee.emergencyContact && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">{t('emergencyContact')}</label>
                        <div className="mt-2 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">{detailedEmployee.emergencyContact.name}</p>
                          <p className="text-sm text-muted-foreground">{detailedEmployee.emergencyContact.relation}</p>
                          <p className="text-sm text-muted-foreground">{detailedEmployee.emergencyContact.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* İş məlumatları */}
              <AccordionItem value="work">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    <span>{t('workInfo')}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('position')}</label>
                      <p className="mt-1 text-sm font-medium">{employee.position}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('department')}</label>
                      <p className="mt-1 text-sm font-medium">{employee.department || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('branch')}</label>
                      <p className="mt-1 text-sm font-medium">{employee.branch}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('structure')}</label>
                      <p className="mt-1 text-sm font-medium">{employee.structure}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {t('workStartDate')}
                      </label>
                      <p className="mt-1 text-sm font-medium">{detailedEmployee.workStartDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('contractType')}</label>
                      <p className="mt-1 text-sm font-medium">{detailedEmployee.contractType}</p>
                    </div>
                    {detailedEmployee.workHistory && detailedEmployee.workHistory.length > 0 && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                          <History className="h-4 w-4" />
                          {t('workHistory')}
                        </label>
                        <div className="space-y-3">
                          {detailedEmployee.workHistory.map((work, index) => (
                            <div key={index} className="p-3 bg-muted rounded-lg">
                              <p className="text-sm font-medium">{work.company}</p>
                              <p className="text-sm text-muted-foreground">{work.position}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {work.startDate} - {work.endDate}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Təhsil */}
              {detailedEmployee.education && detailedEmployee.education.length > 0 && (
                <AccordionItem value="education">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      <span>{t('education')}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {detailedEmployee.education.map((edu, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground">{edu.degree}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {edu.startDate} - {edu.endDate}
                          </p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Maliyyə məlumatları */}
              <AccordionItem value="financial">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span>{t('financialInfo')}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('salary')}</label>
                      <p className="mt-1 text-sm font-medium">{detailedEmployee.salary} AZN</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('bankAccount')}</label>
                      <p className="mt-1 text-sm font-medium font-mono text-xs">{detailedEmployee.bankAccount}</p>
                    </div>
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
