import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/appointment.entity';
import { ReminderService } from './appointment-reminder.service';
import { ReminderProcessor } from './appointment-reminder.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reminderQueue',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    TypeOrmModule.forFeature([Appointment]),
  ],
  providers: [ReminderService, ReminderProcessor, AppointmentReminderModule],
})
export class AppointmentReminderModule {}
