import { DataSource } from 'typeorm';
import { SQLITE_PATH } from './constants';
import { User } from './database/models/user';
import { Session } from './database/models/session';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: SQLITE_PATH,
  synchronize: false,
  logging: true,
  migrationsRun: false,
  entities: [User, Session],
  migrations: ['src/database/migrations/**.ts'],
});
