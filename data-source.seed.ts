import { databaseConfig } from './src/config/database.config'; // must rel import outside nest
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';

const isCompiled = __dirname.includes('dist'); // Check if running from dist (not /dist since windows does \dist, so just dist)
const fileExt = isCompiled ? 'js' : 'ts'; // Use .js in production, .ts in dev
const baseDir = isCompiled ? __dirname : __dirname + '/../src';

// cli does not work so use ifee
void (async () => {
  const dataSource = new DataSource({
    ...databaseConfig,
    // idk why but this does not work 'autoLoadEntities'
    entities: [`${baseDir}/**/*.entity.${fileExt}`],
    seeds: [`${baseDir}/**/*.seeder.${fileExt}`], // Use the correct format
    factories: [`${baseDir}/**/*.factory.${fileExt}`],
  } as DataSourceOptions & SeederOptions);
  await dataSource.initialize();
  void runSeeders(dataSource);
})();
