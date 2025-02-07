import { databaseConfig } from 'src/config/database.config';
import { CreateWaffleTable1738959238260 } from 'src/migrations/1738959238260-CreateWaffleTable';
import { AddStockQuantityColumn1738960482173 } from 'src/migrations/1738960482173-AddStockQuantityColumn';
import { Waffle } from 'src/waffles/entities/waffle.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export default new DataSource({
  ...databaseConfig,
  entities: [Waffle],
  migrations: [
    CreateWaffleTable1738959238260,
    AddStockQuantityColumn1738960482173,
  ],
  logging: true, // Enable logging
  logger: 'advanced-console', // Advanced console logger (logs to console)
} as DataSourceOptions);
