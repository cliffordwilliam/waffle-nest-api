import { databaseConfig } from 'src/config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';

export default new DataSource({
  ...databaseConfig,
  logging: true, // Enable logging
  logger: 'advanced-console', // Advanced console logger (logs to console)
  entities: [__dirname + '/src/**/*.entity{.js,.ts}'],
  migrations: [__dirname + '/src/migrations/*{.js,.ts}'],
} as DataSourceOptions);
