import { prisma } from '../../prisma/client';
import { NotFoundError, BadRequestError } from '../../shared/utils/errors';

export class OrdersService {
  /**
   * Retrieve a paginated list of orders with filters.
   */
  async getOrders(query: {
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

    const formattedOrders = bills.map((bill) => ({
      billId: bill.id,
      billNumber: bill.billNumber,
      date: new Date(bill.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: new Date(bill.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      orderType: bill.orderType,
      paymentMode: bill.paymentMode,
      totalItems: bill.billItems?.reduce((sum, item) => sum + item.quantity, 0) || 0,
      grandTotal: Number(bill.total),
      status: bill.status,
      createdAt: bill.createdAt,
    }));

    return {
      orders: formattedOrders,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    };
  }

  /**
   * Retrieve complete order details by ID, including Settings restaurant metadata.
   */
  async getOrderById(id: number) {
    const [bill, settings] = await Promise.all([
      prisma.bill.findUnique({
        where: { id },
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
      }),
      prisma.setting.findFirst(),
    ]);

    if (!bill) {
      throw new NotFoundError(`Order not found with ID ${id}`);
    }

    const restaurant = {
      name: settings?.restaurantName || 'MYQSR Express',
      address: settings?.address || '123 Food Street, Tech Park, Hyderabad',
      phone: settings?.phone || '+91 98765 43210',
      footerMessage: settings?.footerMessage || 'Thank you for dining with us! Please visit again.',
    };

    return {
      billHeader: {
        billId: bill.id,
        billNumber: bill.billNumber,
        createdAt: bill.createdAt,
        orderType: bill.orderType,
        paymentMode: bill.paymentMode,
        status: bill.status,
        cancelledAt: bill.cancelledAt,
        cancelledBy: bill.cancelledBy,
      },
      billItems: bill.billItems.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.menuItem?.name || `Item #${item.menuItemId}`,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.total),
      })),
      subtotal: Number(bill.subtotal),
      discount: Number(bill.discount),
      gst: Number(bill.gstAmount),
      grandTotal: Number(bill.total),
      restaurant,
    };
  }

  /**
   * Cancel completed order.
   */
  async cancelOrder(id: number, userId: number) {
    const bill = await prisma.bill.findUnique({
      where: { id },
    });

    if (!bill) {
      throw new NotFoundError(`Order not found with ID ${id}`);
    }

    if (bill.status === 'CANCELLED') {
      throw new BadRequestError('This order is already cancelled');
    }

    const updatedBill = await prisma.bill.update({
      where: { id },
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
