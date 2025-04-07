import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('logs')
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/get')
  async getApp() {
    const res = await this.appService.getLogs();
    if (!res) {
      throw new Error(`Логи недоступны`);
    }
    return res;
  }
}
