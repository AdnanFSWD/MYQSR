export interface ReceiptRestaurantInfo {
  name: string;
  address: string;
  phone: string;
}

export interface ReceiptBillInfo {
  billNumber: string;
  dateTime: string;
  orderType: string;
  paymentMode: string;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ReceiptTotals {
  subtotal: number;
  discount: number;
  gst: number;
  grandTotal: number;
}

export interface Receipt {
  restaurant: ReceiptRestaurantInfo;
  billInfo: ReceiptBillInfo;
  items: ReceiptItem[];
  totals: ReceiptTotals;
  footer: string;
}
