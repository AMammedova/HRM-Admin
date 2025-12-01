import { Order } from '../types/order.types';

export const mockOrders: Order[] = Array.from({ length: 10 }).map((_, index) => {
  const id = index + 1;

  return {
    id,
    orderNumber: `GRM11${200 + id}`,
    finCode: '1234567',
    employeeName: `GRM1${1333 + id} - Ağamuradlı Babək Rəhman`,
    startDate: '2002-12-11',
    endDate: '2002-12-11',
    contractEndDate: '2025-05-16',
    structure: 'Quru - qida gündüz',
    position: 'İnsan resursları üzrə kiçik mütəxəssis',
    branch: '177_MB_Naxçıvan_Gənclər_Şəhərciyi',
    createdAt: '2002-12-11',
    updatedAt: '2002-12-11',
  };
});


