import { prisma } from '../../../prisma/client';
import { Bill, PaymentMode, OrderType } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../../../shared/utils/errors';
import { ReceiptBuilder } from '../receipt/receipt-builder.service';

export class CheckoutService {

  /**
   * Execute business checkout workflow inside a single Prisma transaction.
   */
  async checkout(data: {
    orderType: OrderType;
    paymentMode: PaymentMode;
    discountType: 'PERCENTAGE' | 'AMOUNT';
    discountValue: number;
    items: { menuItemId: number; quantity: number }[];
  }): Promise<{
    billId: number;
    billNumber: string;
    createdAt: Date;
    orderType: OrderType;
    paymentMode: PaymentMode;
    subtotal: number;
    discount: number;
    gst: number;
    grandTotal: number;
    items: {
      menuItemId: number;
      quantity: number;
      unitPrice: number;
      total: number;
    }[];
    receipt: any;
  }> {
    const { orderType, paymentMode, discountType, discountValue, items } = data;

    // 1. Zod validated list has at least one item (also checked by caller middleware)
    if (!items || items.length === 0) {
      throw new BadRequestError('At least one item is required for checkout');
    }

    return prisma.$transaction(async (tx) => {
      // 2. Fetch all menu items referenced by the checkout payload
      const menuItemIds = items.map((i) => i.menuItemId);
      const menuItems = await tx.menuItem.findMany({
        where: { id: { in: menuItemIds } },
      });

      // Map menu items for O(1) key lookups
      const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

      let subtotal = 0;

      // 3. Perform existence & availability validations
      for (const item of items) {
        const dbItem = menuItemMap.get(item.menuItemId);
        if (!dbItem) {
          throw new NotFoundError(`MenuItem with ID ${item.menuItemId} does not exist`);
        }
        if (!dbItem.isAvailable) {
          throw new BadRequestError(`MenuItem "${dbItem.name}" is currently unavailable`);
        }
        if (item.quantity <= 0) {
          throw new BadRequestError(`Invalid quantity ${item.quantity} for item "${dbItem.name}"`);
        }

        // Calculate line total: unit price * quantity
        const lineTotal = Number(dbItem.price) * item.quantity;
        subtotal += lineTotal;
      }

      // 4. Calculate invoice totals: Subtotal, Discount, GST (5%), Grand Total
      let discountAmount = 0;
      if (discountType === 'PERCENTAGE') {
        discountAmount = (subtotal * discountValue) / 100;
      } else {
        discountAmount = discountValue;
      }

      // Cap discount at subtotal
      if (discountAmount > subtotal) {
        discountAmount = subtotal;
      }

      const taxableAmount = subtotal - discountAmount;
      const gstAmount = (taxableAmount * 5) / 100; // Flat 5% GST
      const grandTotal = taxableAmount + gstAmount;

      // 5. Generate daily sequential bill number
      const today = new Date();
      const yy = String(today.getFullYear()).slice(-2);
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const datePrefix = `QSR${yy}${mm}${dd}-`;

      // Read latest bill matching today's prefix inside the transaction
      const latestBill = await tx.bill.findFirst({
        where: {
          billNumber: {
            startsWith: datePrefix,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      let sequence = 1;
      if (latestBill) {
        const lastPart = latestBill.billNumber.split('-')[1];
        if (lastPart) {
          const parsedSeq = parseInt(lastPart, 10);
          if (!isNaN(parsedSeq)) {
            sequence = parsedSeq + 1;
          }
        }
      }

      const billNumber = `${datePrefix}${String(sequence).padStart(6, '0')}`;

      // 6. Create Bill and associated BillItems inside the Prisma transaction
      const createdBill = await tx.bill.create({
        data: {
          billNumber,
          orderType,
          paymentMode,
          subtotal,
          discount: discountAmount,
          gstAmount,
          total: grandTotal,
          status: 'COMPLETED',
          billItems: {
            create: items.map((item) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              unitPrice: Number(menuItemMap.get(item.menuItemId)!.price),
              total: Number(menuItemMap.get(item.menuItemId)!.price) * item.quantity,
            })),
          },
        },
        include: {
          billItems: true,
        },
      });

      // Extract nested items out of bill details return
      const { billItems, ...billData } = createdBill as any;

      const totals = {
        subtotal,
        discount: discountAmount,
        gst: gstAmount,
        grandTotal,
      };

      const receipt = ReceiptBuilder.buildReceipt(billData, billItems || [], totals);

      return {
        billId: createdBill.id,
        billNumber: createdBill.billNumber,
        createdAt: createdBill.createdAt,
        orderType: createdBill.orderType,
        paymentMode: createdBill.paymentMode,
        subtotal: Number(createdBill.subtotal),
        discount: Number(createdBill.discount),
        gst: Number(createdBill.gstAmount),
        grandTotal: Number(createdBill.total),
        items: (billItems || []).map((item: any) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          total: Number(item.total),
        })),
        receipt,
      };
    });
  }
}
