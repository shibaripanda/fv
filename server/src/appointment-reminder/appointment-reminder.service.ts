import { InjectQueue } from '@nestjs/bull';
import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Appointment } from 'src/appointment/appointment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectQueue('reminderQueue')
    private reminderQueue: Queue,
  ) {}

  @Cron('*/5 * * * * *')
  async handleReminders() {
    console.log('Cron');
    const now = Math.floor(Date.now() / 1000);

    const oneDayAppointments = await this.appointmentRepo.find({
      where: {
        reminder1Sent: false,
        free: false,
      },
    });

    for (const appt of oneDayAppointments) {
      const time = appt.slot - now;
      console.log(Math.abs(time));
      // if (time < 86400 && time > 80000) {
      if (time < 86400) {
        console.log('1day');
        await this.reminderQueue.add('sendReminder', {
          id: appt.id,
          type: '1day',
        });
      }
      // if (!appt.reminder2Sent && time < 7200 && time > 7000) {
      if (!appt.reminder2Sent && time < 7200) {
        console.log('2hour');
        await this.reminderQueue.add('sendReminder', {
          id: appt.id,
          type: '2hours',
        });
      }
    }
  }
}
