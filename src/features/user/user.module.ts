import { UserResolver } from './user.resolver';
import { Module } from '@nestjs/common';
import { PrismaService } from '@app/common/services/prisma.service';
import { UserService } from './user.service';
import { PasswordService } from '@app/common/services/password.service';

@Module({
  providers: [UserResolver, UserService, PasswordService, PrismaService],
})
export class UserModule {}
