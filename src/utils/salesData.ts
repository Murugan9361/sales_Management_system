import { SalesRecord } from '@/types/sales';

const STORAGE_KEY = 'sales_records';

export const loadSalesData = (): SalesRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return getInitialData();
};

export const saveSalesData = (records: SalesRecord[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

const getInitialData = (): SalesRecord[] => {
  const initialData: SalesRecord[] = [
    {
      id: '1',
      sno: 1,
      date: '2025-01-15',
      name: 'Rajesh Kumar',
      grossSales: 150000,
      vendorPayment: 15000,
      vendorName: 'TechVendor Inc',
      revenueSharingName: 'Partner A',
      revenueSharingAmount: 10000,
      netSales: 125000,
      receivedAmount: 100000,
      pendingAmount: 50000,
      remarks: 'First installment received',
      status: 'Open',
      shape: 'Enterprise',
      branch: 'Chennai',
      branchAdminName: 'Suresh Kumar'
    },
    {
      id: '2',
      sno: 2,
      date: '2025-01-20',
      name: 'Priya Sharma',
      grossSales: 85000,
      vendorPayment: 8500,
      vendorName: 'SalesPartner Co',
      netSales: 76500,
      receivedAmount: 85000,
      pendingAmount: 0,
      remarks: 'Full payment received',
      status: 'Close',
      shape: 'SMB',
      branch: 'Madurai',
      branchAdminName: 'Ramesh Babu'
    },
    {
      id: '3',
      sno: 3,
      date: '2025-01-25',
      name: 'Vikram Reddy',
      grossSales: 200000,
      vendorPayment: 20000,
      vendorName: 'TechVendor Inc',
      revenueSharingName: 'Partner B',
      revenueSharingAmount: 15000,
      netSales: 165000,
      receivedAmount: 50000,
      pendingAmount: 150000,
      remarks: 'Advance payment only',
      status: 'Open',
      shape: 'Enterprise',
      branch: 'Chennai',
      branchAdminName: 'Suresh Kumar'
    },
    {
      id: '4',
      sno: 4,
      date: '2025-02-01',
      name: 'Anitha Menon',
      grossSales: 120000,
      vendorPayment: 12000,
      vendorName: 'ReferralHub',
      netSales: 108000,
      receivedAmount: 120000,
      pendingAmount: 0,
      status: 'Close',
      shape: 'SMB',
      branch: 'Coimbatore',
      branchAdminName: 'Kumar Raj'
    },
    {
      id: '5',
      sno: 5,
      date: '2025-02-05',
      name: 'Mohammed Ali',
      grossSales: 95000,
      vendorPayment: 9500,
      vendorName: 'SalesPartner Co',
      revenueSharingName: 'Partner A',
      revenueSharingAmount: 5000,
      netSales: 80500,
      receivedAmount: 40000,
      pendingAmount: 55000,
      remarks: 'Payment pending',
      status: 'Open',
      shape: 'Startup',
      branch: 'Madurai',
      branchAdminName: 'Ramesh Babu'
    }
  ];
  
  saveSalesData(initialData);
  return initialData;
};
