import { prisma } from '../../prisma/client';

export class DashboardService {
  /**
   * Retrieve aggregated sales metrics, payment breakdown, top items, and recent orders.
   */
  async getDashboardData() {
    // 1. Establish date boundary for "Today" in server local time
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 2. Fetch all bills created today
    const todayBills = await prisma.bill.findMany({
      where: {
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    // 3. Today's Calculations
    let todaySales = 0;
    let todayOrders = 0;
    let cancelledOrders = 0;

    let cashSales = 0;
    let upiSales = 0;
    let cardSales = 0;

    // Hourly map initializer
    const hourlySalesMap: { [hour: string]: number } = {};
    for (let i = 0; i < 24; i++) {
      const hrStr = `${String(i).padStart(2, '0')}:00`;
      hourlySalesMap[hrStr] = 0;
    }

    for (const bill of todayBills) {
      if (bill.status === 'COMPLETED') {
        const amt = Number(bill.total);
        todaySales += amt;
        todayOrders += 1;

        // Payment type accumulator
        if (bill.paymentMode === 'CASH') cashSales += amt;
        if (bill.paymentMode === 'UPI') upiSales += amt;
        if (bill.paymentMode === 'CARD') cardSales += amt;

        // Hourly accumulator
        const hour = bill.createdAt.getHours();
        const hrStr = `${String(hour).padStart(2, '0')}:00`;
        hourlySalesMap[hrStr] += amt;
      } else if (bill.status === 'CANCELLED') {
        cancelledOrders += 1;
      }
    }

    const averageOrderValue = todayOrders > 0 ? Number((todaySales / todayOrders).toFixed(2)) : 0;
    todaySales = Number(todaySales.toFixed(2));

    const hourlySales = Object.entries(hourlySalesMap).map(([hour, sales]) => ({
      hour,
      sales: Number(sales.toFixed(2)),
    }));

    // 4. Fetch Top Selling Items (overall completed orders) using total quantity sold
    const topItemsGrouped = await prisma.billItem.groupBy({
      by: ['menuItemId'],
      _sum: {
        quantity: true,
        total: true,
      },
      where: {
        bill: {
          status: 'COMPLETED',
        },
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    });

    const menuItemIds = topItemsGrouped.map((g) => g.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
      },
      select: {
        id: true,
        name: true,
      },
    });
    const menuItemNameMap = new Map(menuItems.map((m) => [m.id, m.name]));

    const topSellingItems = topItemsGrouped.map((group) => ({
      menuItemId: group.menuItemId,
      name: menuItemNameMap.get(group.menuItemId) || `Item #${group.menuItemId}`,
      quantity: group._sum.quantity || 0,
      sales: Number(group._sum.total || 0),
    }));

    // 5. Fetch Recent Orders (latest 10 orders)
    const recentBills = await prisma.bill.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const recentOrders = recentBills.map((bill) => ({
      billId: bill.id,
      billNumber: bill.billNumber,
      time: new Date(bill.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      orderType: bill.orderType,
      paymentMode: bill.paymentMode,
      grandTotal: Number(bill.total),
      status: bill.status,
    }));

    return {
      today: {
        sales: todaySales,
        orders: todayOrders,
        averageOrderValue,
        cancelledOrders,
      },
      paymentSummary: {
        cash: Number(cashSales.toFixed(2)),
        upi: Number(upiSales.toFixed(2)),
        card: Number(cardSales.toFixed(2)),
      },
      topSellingItems,
      hourlySales,
      recentOrders,
    };
  }
}
