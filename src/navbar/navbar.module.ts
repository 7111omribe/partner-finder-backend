import { Module } from '@nestjs/common';
import { NavbarController } from './navbar.controller';
import { NavbarService } from './navbar.service';

@Module({
  controllers: [NavbarController],
  providers: [NavbarService],
})
export class NavbarModule {}
