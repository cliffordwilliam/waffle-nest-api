import { config } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
config(); // outside nest need to explicit call to parse env to process

export const databaseConfig = {
  type: process.env.DATABASE_TYPE || 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'test',
};

export default registerAs(
  'database',
  () =>
    ({
      ...databaseConfig,
      autoLoadEntities: true,
    }) as TypeOrmModuleOptions,
);
