export type SelectReportTransactions = {
  id: string;
  skuId: string;
  type: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  documentNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  sku: { id: string; skuCode: string; name: string };
  supplier: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
  createdBy: { id: string; name: string } | null;
};
