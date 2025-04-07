import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUserByPhone(phone, name) {
    let user = await this.usersRepository.findOne({ where: { phone: phone } });
    if (!user) {
      const newUser = this.usersRepository.create({ phone, name });
      user = await this.usersRepository.save(newUser);
    } else {
      if (user.name !== name) {
        await this.usersRepository.update({ phone }, { name });
      }
    }
    return user;
  }
}
