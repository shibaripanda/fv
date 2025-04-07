import { Controller, Get } from '@nestjs/common';
import { DoctorService } from './doctor.service';

@Controller('doctors')
export class DoctorController {
  constructor(private doctorsService: DoctorService) {}
  @Get('/get')
  async getApp() {
    const res = await this.doctorsService.findAll();
    if (!res) {
      throw new Error(`Время недоступно`);
    }
    return res;
  }
}
