export interface SalesRecord {
  id: string;
  sno: number;
  date: string;
  name: string;
  grossSales: number;
  vendorPayment: number;
  vendorName: string;
  revenueSharingName?: string;
  revenueSharingAmount?: number;
  netSales: number;
  receivedAmount: number;
  pendingAmount: number;
  remarks?: string;
  status: "Open" | "Close";
  shape: string;
  branch: string;
  branchAdminName: string;
}

export interface SalesSummary {
  totalGrossSales: number;
  totalReferralAmount: number;
  totalRevenueSharing: number;
  totalNetSales: number;
  totalCollectedAmount: number;
  totalPendingAmount: number;
}
