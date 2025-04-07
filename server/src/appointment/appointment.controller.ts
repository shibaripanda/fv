import { Controller, Get, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('slots')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Get('/get')
  async getApp(@Query('docid') docid: string) {
    const res = await this.appointmentService.getSlotsByDoctorId(docid);
    if (!res) {
      throw new Error(`Ошибка`);
    }
    return res;
  }

  @Get('/makeApp')
  async makeApp(@Query() make: string) {
    const res = await this.appointmentService.makeAppointment(make);
    if (!res) {
      return {
        message: 'Ошибка записи, возможно время заняли. Вас не вылечат, Аминь.',
      };
    }
    return { message: 'Вас вылечат, Донт вори, би хэппи!' };
  }
}
