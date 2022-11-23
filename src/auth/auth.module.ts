import { User } from './../user/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {JwtModule} from "@nestjs/jwt";
import { UsersModule } from 'src/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      SequelizeModule.forFeature([User]),
      JwtModule.register({
        secret: process.env.PRIVATE_KEY || 'SECRET',
        signOptions: {
          expiresIn: '24h'
        }
      })
  ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}
