'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/shared/atoms/Card';
import { Button } from '@/shared/atoms/Button';
import { Input } from '@/shared/atoms/Input';
import { Checkbox } from '@/shared/atoms/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/atoms/Select';
import { Users, Plane } from 'lucide-react';

export interface AttendanceContainerProps {
  locale: string;
}

export function AttendanceContainer({ locale }: AttendanceContainerProps) {
  const t = useTranslations('attendance');
  const tCommon = useTranslations('common');

  const [selectedWeek, setSelectedWeek] = React.useState(1);
  const [year, setYear] = React.useState(new Date().getFullYear().toString());
  const [month, setMonth] = React.useState((new Date().getMonth() + 1).toString());
  const [openAttendanceOnly, setOpenAttendanceOnly] = React.useState(true);

  // Mock data
  const totalEmployees = 5367;
  const onLeave = 0;

  const weeks = Array.from({ length: 6 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving attendance:', {
      week: selectedWeek,
      year,
      month,
      openAttendanceOnly,
    });
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('totalEmployees')}</p>
                <p className="text-2xl font-bold">{totalEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Plane className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('onLeave')}</p>
                <p className="text-2xl font-bold">{onLeave}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Schedule */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6">{t('attendanceSchedule')}</h3>

          {/* Week Selection */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {weeks.map((week) => (
              <Button
                key={week}
                variant={selectedWeek === week ? 'default' : 'outline'}
                onClick={() => setSelectedWeek(week)}
                className={selectedWeek === week ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                {t('weekNumber', { number: week })}
              </Button>
            ))}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{t('year')}</label>
                <Input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2025"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t('positions')}</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('positions')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Hamısı</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t('structureLevel')}</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('structureLevel')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Hamısı</SelectItem>
                    <SelectItem value="level1">Səviyyə 1</SelectItem>
                    <SelectItem value="level2">Səviyyə 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{t('month')}</label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('month')} />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m.toString()}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t('branches')}</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('branches')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Hamısı</SelectItem>
                    <SelectItem value="branch1">Filial 1</SelectItem>
                    <SelectItem value="branch2">Filial 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t('employee')}</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('employee')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Hamısı</SelectItem>
                    <SelectItem value="emp1">İşçi 1</SelectItem>
                    <SelectItem value="emp2">İşçi 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="openAttendance"
                checked={openAttendanceOnly}
                onCheckedChange={(checked) => setOpenAttendanceOnly(checked === true)}
              />
              <label
                htmlFor="openAttendance"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t('openAttendanceEmployees')}
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              {tCommon('save')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

