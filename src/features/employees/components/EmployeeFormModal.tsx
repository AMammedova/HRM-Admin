'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/atoms/Dialog';
import { Button } from '@/shared/atoms/Button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/atoms/Form';
import { Input } from '@/shared/atoms/Input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types/employee.types';
import { useTranslations } from 'next-intl';
import { Calendar } from '@/shared/atoms/Calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/atoms/Popover';
import { cn } from '@/shared/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/atoms/Select';

const employeeFormSchema = z.object({
  code: z.string().min(1, { message: 'Employee code is required' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  position: z.string().min(1, { message: 'Position is required' }),
  branch: z.string().min(1, { message: 'Branch is required' }),
  fin: z.string().min(1, { message: 'FIN is required' }),
  structure: z.string().min(1, { message: 'Structure is required' }),

  // Empty string becomes undefined
  email: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z.string().email({ message: 'Invalid email address' }).optional(),
  ),
  phone: z.string().optional(),

  // Dates are normalized to Date or undefined
  birthDate: z.preprocess(
    (val) => (val ? new Date(val as any) : undefined),
    z.date().optional(),
  ),
  address: z.string().optional(),
  passportNumber: z.string().optional(),
  passportIssueDate: z.preprocess(
    (val) => (val ? new Date(val as any) : undefined),
    z.date().optional(),
  ),
  passportExpiryDate: z.preprocess(
    (val) => (val ? new Date(val as any) : undefined),
    z.date().optional(),
  ),
  workStartDate: z.preprocess(
    (val) => (val ? new Date(val as any) : undefined),
    z.date().optional(),
  ),
  contractType: z.string().optional(),

  // Allow string or number, coerce to number or undefined
  salary: z.preprocess((val) => {
    if (val === '' || val === undefined || val === null) return undefined;
    const n = Number(val);
    return Number.isNaN(n) ? undefined : n;
  }, z.number().optional()),

  bankAccount: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EmployeeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Partial<Employee> | null;
  onSubmit:any;
  isSubmitting?: boolean;
}

export function EmployeeFormModal({
  open,
  onOpenChange,
  employee,
  onSubmit,
  isSubmitting = false,
}: EmployeeFormModalProps) {
  const t = useTranslations('employees');
  const tCommon = useTranslations('common');

  const getDefaultValues = React.useCallback((): EmployeeFormValues => {
    if (employee) {
      return {
        code: employee.code ?? '',
        firstName: employee.firstName ?? '',
        lastName: employee.lastName ?? '',
        position: employee.position ?? '',
        branch: employee.branch ?? '',
        fin: employee.fin ?? '',
        structure: employee.structure ?? '',
        email: employee.email ?? '',
        phone: employee.phone ?? '',
        birthDate: employee.birthDate ? new Date(employee.birthDate) : undefined,
        address: employee.address ?? '',
        passportNumber: employee.passportNumber ?? '',
        passportIssueDate: employee.passportIssueDate ? new Date(employee.passportIssueDate) : undefined,
        passportExpiryDate: employee.passportExpiryDate ? new Date(employee.passportExpiryDate) : undefined,
        workStartDate: employee.workStartDate ? new Date(employee.workStartDate) : undefined,
        contractType: employee.contractType ?? '',
        salary: employee.salary ?? undefined,
        bankAccount: employee.bankAccount ?? '',
      };
    }

    return {
      code: '',
      firstName: '',
      lastName: '',
      position: '',
      branch: '',
      fin: '',
      structure: '',
      email: '',
      phone: '',
      birthDate: undefined,
      address: '',
      passportNumber: '',
      passportIssueDate: undefined,
      passportExpiryDate: undefined,
      workStartDate: undefined,
      contractType: '',
      salary: undefined,
      bankAccount: '',
    };
  }, [employee]);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: getDefaultValues(),
  });

  React.useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  }, [employee, open, form, getDefaultValues]);

  const handleSubmit: SubmitHandler<EmployeeFormValues> = (data) => {
    const formattedData: CreateEmployeeDto | UpdateEmployeeDto = {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : undefined,
      passportIssueDate: data.passportIssueDate ? new Date(data.passportIssueDate).toISOString() : undefined,
      passportExpiryDate: data.passportExpiryDate ? new Date(data.passportExpiryDate).toISOString() : undefined,
      workStartDate: data.workStartDate ? new Date(data.workStartDate).toISOString() : undefined,
    };

    onSubmit?.(formattedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {employee ? t('editEmployee') : t('addEmployee')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('employeeCode')}</FormLabel>
                    <FormControl>
                      <Input placeholder="GRM123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FİN</FormLabel>
                    <FormControl>
                      <Input placeholder="AZE12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('firstName')}</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('lastName')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Position */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('position')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectPosition')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Branch */}
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('branch')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectBranch')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="baku">Baku</SelectItem>
                        <SelectItem value="ganja">Ganja</SelectItem>
                        <SelectItem value="sumgait">Sumgait</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Structure */}
              <FormField
                control={form.control}
                name="structure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('structure')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectStructure')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="it">IT Department</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('phone')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+994501234567"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth date */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('birthDate')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Work start date */}
              <FormField
                control={form.control}
                name="workStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('workStartDate')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contract type */}
              <FormField
                control={form.control}
                name="contractType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contractType')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectContractType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Salary */}
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('salary')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Passport number */}
              <FormField
                control={form.control}
                name="passportNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('passportNumber')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="AZE1234567"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Passport issue date */}
              <FormField
                control={form.control}
                name="passportIssueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('passportIssueDate')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Passport expiry date */}
              <FormField
                control={form.control}
                name="passportExpiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('passportExpiryDate')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bank account */}
              <FormField
                control={form.control}
                name="bankAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('bankAccount')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="AZ00XXXX00000000000000000000"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t('address')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St, Baku, Azerbaijan"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? tCommon('saving') : tCommon('save')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EmployeeFormModal;