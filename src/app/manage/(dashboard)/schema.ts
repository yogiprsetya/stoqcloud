interface LowStockItem {
  id: string;
  name: string;
  skuCode: string;
  stock: number;
}

interface MostOutboundItem {
  skuId: string;
  skuCode: string;
  name: string;
  quantity: number;
}

export interface SelectAnalyticsDashboard {
  totalStock: number;
  lowStock: LowStockItem[];
  mostOutbound: MostOutboundItem[];
  inventoryValue: number;
  totalOutboundThisMonth: number;
}
