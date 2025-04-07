import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { UserGetAppDto } from './dto/UserGetApp.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private userService: UserService,
  ) {}

  // async onApplicationBootstrap() {
  //   setTimeout(async () => {
  //     const res = await this.getActivSlots();
  //     console.log(res);
  //   }, 5000);
  // }

  async getActivSlots() {
    return await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .where(
        "STR_TO_DATE(appointment.slot, '%Y-%m-%dT%H:%i:%s.000Z') IS NOT NULL",
      )
      .andWhere(
        "STR_TO_DATE(appointment.slot, '%Y-%m-%dT%H:%i:%s.000Z') > NOW()",
      )
      .andWhere('appointment.free = false')
      .getMany();
  }
  async createAppointment(doctor_id, slot, doctor) {
    const res = this.appointmentsRepository.create({
      doctor_id,
      slot,
      doctor,
    });
    return this.appointmentsRepository.save(res);
  }
  async deleteAll() {
    await this.appointmentsRepository.delete({});
  }
  async userGetAppointment(userGetAppDto: UserGetAppDto) {
    const res = await this.appointmentsRepository.update(
      {
        id: userGetAppDto.slot_id,
        free: true,
      },
      { user: { id: userGetAppDto.user_id }, free: false },
    );
    // if (res.affected === 0) {
    //   const res = await this.appointmentsRepository.findOne({
    //     id: userGetAppDto.slot_id,
    //     free: false,
    //     user: { id: userGetAppDto.user_id },
    //   });
    //   console.log('hhhh', res);
    // }
    console.log(res.affected);
    return res.affected;
  }
  async getSlotsByDoctorId(doctor_id: string) {
    return await this.appointmentsRepository.find({
      where: {
        doctor_id: Number(doctor_id),
        free: true,
      },
    });
  }
  async makeAppointment(make) {
    const user = await this.userService.getUserByPhone(make.phone, make.name);
    const res = await this.userGetAppointment({
      slot_id: Number(make.id),
      user_id: Number(user.id),
    });
    return res;
  }
}
