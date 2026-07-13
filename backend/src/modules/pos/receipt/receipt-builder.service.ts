import { Receipt, ReceiptItem } from './receipt.interface';
import { Bill } from '@prisma/client';

export class ReceiptBuilder {
  /**
   * Construct a standard receipt response object.
   */
  static buildReceipt(
    bill: Bill,
    billItems: any[],
    totals: {
      subtotal: number;
      discount: number;
      gst: number;
      grandTotal: number;
    }
  ): Receipt {
    // Standard QSR restaurant metadata
    const restaurant = {
      name: 'MYQSR Express',
      address: '123 Food Street, Tech Park, Hyderabad',
      phone: '+91 98765 43210',
    };

    // Format Bill Information
    const billInfo = {
      billNumber: bill.billNumber,
      dateTime: new Date(bill.createdAt).toISOString(),
      orderType: bill.orderType === 'DINE_IN' ? 'Dine In' : 'Take Away',
      paymentMode: bill.paymentMode,
    };

    // Format items details
    const items: ReceiptItem[] = billItems.map((item) => ({
      name: item.menuItem?.name || `Item #${item.menuItemId}`,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.total),
    }));

    // Formats invoice totals
    const totalsData = {
      subtotal: totals.subtotal,
      discount: totals.discount,
      gst: totals.gst,
      grandTotal: totals.grandTotal,
    };

    // Footer note
    const footer = 'Thank you for dining with us! Please visit again.';

    return {
      restaurant,
      billInfo,
      items,
      totals: totalsData,
      footer,
    };
  }
}
