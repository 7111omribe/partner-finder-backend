import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './custom-exception.filter';
import { NavbarModule } from './navbar/navbar.module';

@Module({
  imports: [UsersModule, NavbarModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: CustomExceptionFilter,
  }],
})
export class AppModule { }
