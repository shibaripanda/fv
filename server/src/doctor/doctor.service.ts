import { Injectable } from '@nestjs/common';
import { Doctor } from './doctor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDoctorDto } from './dto/CreateDoctor.dto';
import { doctors, getPrettyTime, getSlots } from 'src/dataForTest';
import { AppointmentService } from 'src/appointment/appointment.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    private appointmentService: AppointmentService,
  ) {}

  async onApplicationBootstrap() {
    await this.dbStart();
  }

  async dbStart() {
    console.log(process.env.PRELOAD);
    if (!(await this.findAll()).length || process.env.PRELOAD === 'yes') {
      await this.appointmentService.deleteAll();
      await this.doctorsRepository.delete({});
      const logFilePath = path.join(__dirname, process.env.LOG_B);
      fs.truncate(logFilePath, (err) => {
        if (err) {
          console.error('Error log', err);
        }
      });
      for (const doc of doctors) {
        const newDoctor = await this.createDoctor(doc);
        console.log('add Doctor', newDoctor);
        // console.log('getTimeFuture', getTimeFuture(0, 1));
        for (let countDays = 0; countDays < 2; countDays++) {
          for (let countHours = 9; countHours < 22; countHours++) {
            const time = getSlots(countHours, countDays);
            if (time > Date.now() / 1000) {
              const res = await this.appointmentService.createAppointment(
                newDoctor.id,
                time,
                newDoctor.id,
              );
              console.log(getPrettyTime(res.slot));
            }
          }
        }
        // for (let countDays = 0; countDays < 7; countDays++) {
        //   for (let countHours = 9; countHours < 17; countHours++) {
        //     const time = getSlots(countHours, countDays);
        //     if (time > Date.now() / 1000) {
        //       const res = await this.appointmentService.createAppointment(
        //         newDoctor.id,
        //         time,
        //         newDoctor.id,
        //       );
        //       console.log(getPrettyTime(res.slot));
        //     }
        //   }
        // }
      }
    }
  }

  createDoctor(doctorDto: CreateDoctorDto): Promise<any> {
    const res = this.doctorsRepository.create(doctorDto);
    return this.doctorsRepository.save(res);
  }

  findAll(): Promise<Doctor[]> {
    return this.doctorsRepository.find();
  }
}
