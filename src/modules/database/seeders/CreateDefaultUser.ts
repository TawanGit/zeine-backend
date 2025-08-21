import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
export async function createDefaultUser(prisma: PrismaService) {
  const defaultEmail = 'zeine@hire.com';
  const existing = await prisma.user.findFirst({
    where: { email: defaultEmail },
  });

  const hashPassword = await bcrypt.hash('123', 10);

  if (!existing) {
    await prisma.user.create({
      data: {
        email: defaultEmail,
        password: hashPassword,
      },
    });

    console.log('✅ Default user created');
  }
}
