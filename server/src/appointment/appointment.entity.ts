import { Doctor } from 'src/doctor/doctor.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'appointment_id',
  })
  id: number;

  @Column({
    nullable: true,
  })
  user_id: number;

  @Column({
    nullable: false,
  })
  doctor_id: number;

  @Column({
    nullable: false,
    type: 'int',
  })
  slot: number;

  @Column({
    nullable: false,
    default: true,
  })
  free: boolean;

  @Column({ default: false })
  reminder1Sent: boolean;

  @Column({ default: false })
  reminder2Sent: boolean;

  @ManyToOne(() => User, (user) => user.appointments)
  user: User;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  doctor: Doctor;
}
