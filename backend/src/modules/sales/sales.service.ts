import { prisma } from '../../prisma/client';
import { NotFoundError, BadRequestError } from '../../shared/utils/errors';

export class SalesService {
  /**
   * Retrieve a paginated list of bills with optional filters.
   */
  async getBills(query: {
    page?: string;
    limit?: string;
    date?: string;
    billNumber?: string;
    paymentMode?: string;
    orderType?: string;
    status?: string;
  }) {
    const pageNumber = Number(query.page || 1);
    const limitNumber = Number(query.limit || 10);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};

    if (query.date) {
      const dateStart = new Date(query.date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(query.date);
      dateEnd.setHours(23, 59, 59, 999);
      where.createdAt = {
        gte: dateStart,
        lte: dateEnd,
      };
    }

    if (query.billNumber) {
      where.billNumber = {
        contains: query.billNumber.trim(),
        mode: 'insensitive',
      };
    }

    if (query.paymentMode && query.paymentMode !== 'ALL') {
      where.paymentMode = query.paymentMode;
    }

    if (query.orderType && query.orderType !== 'ALL') {
      where.orderType = query.orderType;
    }

    if (query.status && query.status !== 'ALL') {
      where.status = query.status;
    }

    const [bills, totalCount] = await Promise.all([
      prisma.bill.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNumber,
        include: {
          billItems: true,
        },
      }),
      prisma.bill.count({ where }),
    ]);

    const formattedBills = bills.map((bill) => ({
      id: bill.id,
      billNumber: bill.billNumber,
      createdAt: bill.createdAt,
      orderType: bill.orderType,
      paymentMode: bill.paymentMode,
      grandTotal: Number(bill.total),
      status: bill.status,
      totalItems: bill.billItems?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    }));

    return {
      bills: formattedBills,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    };
  }

  /**
   * Retrieve full details of a specific bill by ID.
   */
  async getBillById(billId: number) {
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: {
        billItems: {
          include: {
            menuItem: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!bill) {
      throw new NotFoundError(`Bill not found with ID ${billId}`);
    }

    return {
      id: bill.id,
      billNumber: bill.billNumber,
      createdAt: bill.createdAt,
      orderType: bill.orderType,
      paymentMode: bill.paymentMode,
      status: bill.status,
      cancelledAt: bill.cancelledAt,
      cancelledBy: bill.cancelledBy,
      totals: {
        subtotal: Number(bill.subtotal),
        discount: Number(bill.discount),
        gst: Number(bill.gstAmount),
        grandTotal: Number(bill.total),
      },
      items: bill.billItems.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.menuItem?.name || `Item #${item.menuItemId}`,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.total),
      })),
    };
  }

  /**
   * Cancel an existing completed bill.
   */
  async cancelBill(billId: number, userId: number) {
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
    });

    if (!bill) {
      throw new NotFoundError(`Bill not found with ID ${billId}`);
    }

    if (bill.status === 'CANCELLED') {
      throw new BadRequestError('This bill is already cancelled');
    }

    const updatedBill = await prisma.bill.update({
      where: { id: billId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelledBy: userId,
      },
    });

    return {
      id: updatedBill.id,
      billNumber: updatedBill.billNumber,
      status: updatedBill.status,
      cancelledAt: updatedBill.cancelledAt,
      cancelledBy: updatedBill.cancelledBy,
    };
  }
}
