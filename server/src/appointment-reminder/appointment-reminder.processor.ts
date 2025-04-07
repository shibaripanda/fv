/* eslint-disable prettier/prettier */
import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Appointment } from 'src/appointment/appointment.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { getPrettyTime } from 'src/dataForTest';

@Processor('reminderQueue')
export class ReminderProcessor {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  @Process('sendReminder')
  async handleReminder(
    job: Job<{
      id: number;
      type: '1day' | '2hours';
    }>,
  ) {
    const { id, type } = job.data;
    const appointment = await this.appointmentRepo.findOne({ where: { id }, relations: ['doctor', 'user'] });
    
    if (!appointment) return;

    console.log('Напоминание')

    const addToLog = (text) => {
        const logFilePath = path.join(__dirname, process.env.LOG_B);
        fs.appendFile(logFilePath, text + '\n', (err) => {
            if(err){
            console.error('Error log', err);
            }
        });
    }

    if (type === '1day') {
      console.log('processsor 1day')
        const rem = `${new Date((Date.now())).toLocaleString() } | Привет ${appointment.user.name}! Напоминаем что вы записаны к ${appointment.doctor.name} завтра в ${getPrettyTime(appointment.slot)}!`;
        addToLog(rem)
        appointment.reminder1Sent = true;
    }
    else if (type === '2hours') {
      console.log('processsor 2hours')
        const rem = `${new Date((Date.now())).toLocaleString() } | Привет ${appointment.user.name}! Вам через 2 часа к  ${appointment.doctor.name} в ${getPrettyTime(appointment.slot)}!`;
        addToLog(rem)
        appointment.reminder2Sent = true;
    }

    await this.appointmentRepo.save(appointment);
  }
}
