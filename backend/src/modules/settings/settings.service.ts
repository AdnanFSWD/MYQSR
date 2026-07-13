import { prisma } from '../../prisma/client';

export class SettingsService {
  /**
   * Helper to fetch settings, seeding with default properties if not found.
   */
  private async ensureSettingsExist() {
    const settings = await prisma.setting.findFirst();
    if (!settings) {
      return await prisma.setting.create({
        data: {
          restaurantName: 'MYQSR Express',
          phone: '+91 98765 43210',
          email: 'admin@myqsr.com',
          gstNumber: '36AAAAA1111A1Z1',
          fssaiNumber: '12345678901234',
          address: '123 Food Street, Tech Park',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500081',
          gstPercentage: 5.0,
          currency: 'INR',
          roundOffBills: true,
          defaultPaymentMode: 'CASH',
          billPrefix: 'QSR',
          receiptHeader: 'Welcome to MYQSR',
          receiptFooter: 'Thank you for dining with us!',
          footerMessage: 'Thank you for dining with us!',
          printerWidth: 80,
          timezone: 'Asia/Kolkata',
          dateFormat: 'DD-MM-YYYY',
          timeFormat: '12-hour',
        },
      });
    }
    return settings;
  }

  /**
   * Fetch settings record.
   */
  async getSettings() {
    const settings = await this.ensureSettingsExist();
    return {
      ...settings,
      gstPercentage: Number(settings.gstPercentage),
      printerWidth: Number(settings.printerWidth),
    };
  }

  /**
   * Update settings record.
   */
  async updateSettings(data: any) {
    const current = await this.ensureSettingsExist();

    const updateData: any = {
      restaurantName: data.restaurantName,
      phone: data.phone,
      email: data.email,
      gstNumber: data.gstNumber,
      fssaiNumber: data.fssaiNumber,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      currency: data.currency,
      defaultPaymentMode: data.defaultPaymentMode,
      billPrefix: data.billPrefix,
      receiptHeader: data.receiptHeader,
      receiptFooter: data.receiptFooter,
      footerMessage: data.receiptFooter, // keep in sync
      timezone: data.timezone,
      dateFormat: data.dateFormat,
      timeFormat: data.timeFormat,
    };

    if (data.gstPercentage !== undefined) {
      updateData.gstPercentage = Number(data.gstPercentage);
    }
    if (data.printerWidth !== undefined) {
      updateData.printerWidth = Number(data.printerWidth);
    }
    if (data.roundOffBills !== undefined) {
      updateData.roundOffBills = Boolean(data.roundOffBills);
    }

    const updated = await prisma.setting.update({
      where: { id: current.id },
      data: updateData,
    });

    return {
      ...updated,
      gstPercentage: Number(updated.gstPercentage),
      printerWidth: Number(updated.printerWidth),
    };
  }
}
