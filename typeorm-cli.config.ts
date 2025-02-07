import { config } from 'dotenv';
import { getDatabaseConfig } from 'src/config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';
config(); // outside nest need to explicit call to parse env to process

export default new DataSource({
  ...getDatabaseConfig(),
  entities: [__dirname + '/src/**/*.entity{.js,.ts}'],
  migrations: [__dirname + '/src/migrations/*{.js,.ts}'],
} as DataSourceOptions);
