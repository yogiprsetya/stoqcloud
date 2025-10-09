export type SelectReportStock = {
  id: string;
  skuCode: string;
  name: string;
  stock: string;
  costPrice: number;
  inventoryValue: number;
  category: {
    id: string;
    name: string;
  } | null;
  supplier: {
    id: string;
    name: string;
  } | null;
};
