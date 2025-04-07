import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { Doctor } from './doctor/doctor.entity';
import { Appointment } from './appointment/appointment.entity';
import { AppointmentReminderModule } from './appointment-reminder/appointment-reminder.module';
import { ScheduleModule } from '@nestjs/schedule';
// import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    // BullModule.forRoot({
    //   redis: {
    //     host: process.env.REDIS_HOST || 'localhost',
    //     port: parseInt(process.env.REDIS_PORT || '6379', 10),
    //   },
    // }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB,
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'fv_db',
      entities: [User, Doctor, Appointment],
      synchronize: true,
    }),
    UserModule,
    DoctorModule,
    AppointmentModule,
    AppointmentReminderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
