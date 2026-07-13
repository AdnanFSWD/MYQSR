import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/client';
import { UnauthorizedError, BadRequestError } from '../../shared/utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'qsr-super-secret-key-12345';

export class AuthService {
  /**
   * Helper to automatically seed default admin/admin if the users table is empty.
   */
  private async ensureDefaultAdminExists(): Promise<void> {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await prisma.user.create({
        data: {
          name: 'Administrator',
          email: 'admin', // Storing username in email field
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
    }
  }

  /**
   * Authenticate user credentials and generate a JWT access token.
   */
  async login(username: string, password: string) {
    // 1. Auto-seed admin user if database is empty
    await this.ensureDefaultAdminExists();

    // 2. Lookup user by username (mapped to email field)
    const user = await prisma.user.findUnique({
      where: { email: username.trim() },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid username or password');
    }

    // 3. Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid username or password');
    }

    // 4. Generate JWT access token
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' } // Valid for 1 day
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.email,
        role: user.role,
      },
      accessToken,
    };
  }

  /**
   * Change user password.
   */
  async changePassword(userId: number, data: { oldPassword: string; newPassword: string }) {
    const { oldPassword, newPassword } = data;

    // 1. Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    // 2. Validate current password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid current password');
    }

    // 3. Hash and store new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }
}
