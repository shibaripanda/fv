import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor]), AppointmentModule],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
