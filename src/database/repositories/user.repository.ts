import { AppDataSource } from '../../data-source';
import { User } from '../models/user';
import { FindOptionsWhere, DeepPartial } from 'typeorm';

export const UserRepository = AppDataSource.getRepository(User).extend({
  async findOrCreate(search: FindOptionsWhere<User>, initial: DeepPartial<User>) {
    let user = await this.findOneBy(search);
    if (!user) {
      user = this.create(initial);
    }

    return user;
  },
});
