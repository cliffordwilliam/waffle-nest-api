# why use nest

```
enterprise grade
focus on app, not config
```

# get node lts, nest cli globally, make nest app

```bash
nvm install --lts
nvm use --lts
node -v
npm i -g @nestjs/cli
nest new
```

# get vs code (say yes to adding the Microsoft repository and signing key)

```bash
wget -O code-latest.deb 'https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64'
sudo apt install ./code-latest.deb
rm code-latest.deb
code
```

# remove vs code

```bash
sudo apt remove --purge code
rm -rf ~/.config/Code
rm -rf ~/.vscode
sudo rm -rf /var/lib/snapd/desktop/applications/code*
sudo rm -rf /var/lib/code
```

# update vs code

```bash
sudo apt update
sudo apt upgrade
sudo apt install --only-upgrade code
```

# get eslint and prettier vs code extension

```
ESLint
Prettier
```

# update vs code settings to format and lint on save

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

# whenever you npm i, restart eslint, reload window / when u get eslint err try to reload it too

```
ctrl shift p
restart eslint server
reload window
```

# use workspace ts

```
cursor must be in ts file
ctrl shift p
select typeScript version
```

# get husky

```bash
npm install --save-dev husky
```

# add lint stages

Run tasks like formatters and linters against staged git files and don't let 💩 slip into your code base!

```bash
npm install --save-dev lint-staged
```

# add lint staged to package.json

```json
,
  "lint-staged": {
    "*.{js,ts,tsx}": [
      "npm run lint",
      "npm run format"
    ]
  }
```

# husky uses lint staged (root/.husky/pre-commit)

```
npx lint-staged
```

# watch mode

```bash
npm run start:dev
```

# add rate limiter

```bash
npm i --save @nestjs/throttler
```

# init the rate limiter module

```javascript
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
})
export class AppModule {}
```

# create waffle resource

```bash
nest g resource
```

# bind global pipe in entry file to validate dto and transform

```javascript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
```

# get class validator deps to decor dto

```bash
npm i class-validator class-transformer
```

# update dto

```javascript
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateWaffleDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsBoolean()
  @IsOptional()
  isGlutenFree?: boolean;
}
```

# get nest config module dep

```bash
npm i @nestjs/config
```

# create .env

```
NODE_ENV=asd

DATABASE_TYPE=asd
DATABASE_USER=asd
DATABASE_PASSWORD=asd
DATABASE_NAME=asd
DATABASE_PORT=asd
DATABASE_HOST=asd

JWT_SECRET=use this in bash "$ openssl rand -base64 32"
JWT_TOKEN_AUDIENCE=asd
JWT_TOKEN_ISSUER=asd

REDIS_HOST=asd
REDIS_PORT=asd
REDIS_PASSWORD=asd

BCRYPT_SALT=asd

CLOUDINARY_API_SECRET=asd
CLOUDINARY_API_KEY=asd
CLOUDINARY_CLOUD_NAME=asd

FRONTEND_URL=asd

STRIPE_SECRET=asd
```

# get joi

```bash
npm install joi
npm install --save-dev @types/joi
```

# create validation file (config/env.validation.ts)

```javascript
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  DATABASE_TYPE: Joi.string()
    .valid('postgres', 'mysql', 'mariadb', 'sqlite', 'mssql')
    .required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_PORT: Joi.number().integer().default(5432),
  DATABASE_HOST: Joi.string().hostname().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),

  REDIS_HOST: Joi.string().hostname().required(),
  REDIS_PORT: Joi.number().integer().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),

  BCRYPT_SALT: Joi.number().integer().min(1).max(20).default(10),

  CLOUDINARY_API_SECRET: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),

  FRONTEND_URL: Joi.string().uri().required(),

  STRIPE_SECRET: Joi.string().required(),
});
```

# make root db config (root/config/database.config.ts)

```javascript
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: process.env.DATABASE_TYPE || 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'test',
  autoLoadEntities: true,
}));
```

# make root app config (root/config/app.config.ts)

```javascript
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
}));
```

# init config module with joi validation and root configs

```javascript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { envValidationSchema } from './config/env.validation';
import { WafflesModule } from './waffles/waffles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envValidationSchema,
      load: [appConfig, databaseConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    WafflesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

# make local postgresql (use odin guide to install and use)

```
# enter postgresql shell
psql

# create db for this nest app
CREATE DATABASE your_db_name;

# exit shell
\q
```

# get typeorm module

```bash
npm i @nestjs/typeorm typeorm pg
```

# edit root db config to use typeorm type

```javascript
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  () =>
    ({
      type: process.env.DATABASE_TYPE || 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'test',
      autoLoadEntities: true,
    }) as TypeOrmModuleOptions,
);
```

# init typeorm module

```javascript
import databaseConfig from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
  ],
})
```

# check if connection is okay

```
run watch mode
see if typeorm deps initialized = that means connection to local db is ok
```

# add node version explicit in package.json

```json
  "engines": {
    "node": ">=22.0.0"
  }
```

# login to railway

```bash
npm i -g @railway/cli
railway login
```

# prepare env for railway

```
NODE_ENV=asd

DATABASE_TYPE=postgres
DATABASE_USER=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
DATABASE_NAME=${{Postgres.PGDATABASE}}
DATABASE_PORT=5432
DATABASE_HOST=${{Postgres.PGHOST}}

JWT_SECRET=use this in bash "$ openssl rand -base64 32"
JWT_TOKEN_AUDIENCE=asd
JWT_TOKEN_ISSUER=asd

REDIS_HOST=asd
REDIS_PORT=asd
REDIS_PASSWORD=asd

BCRYPT_SALT=asd

CLOUDINARY_API_SECRET=asd
CLOUDINARY_API_KEY=asd
CLOUDINARY_CLOUD_NAME=asd

FRONTEND_URL=asd

STRIPE_SECRET=asd
```

# init railway in proj root, add postgres service, add web server service

pick Empty Service for this web server service, name is repo name

Enter a variable one by one, e.g. DB_DATABASE=${{Postgres.PGDATABASE}}

press enter to stop

railway up to deploy

this is private connection between web server and postgres

```bash
railway init
railway add -d postgres
railway add
railway up
railway logout
```

then connect to a source repo on github, on push this will redeploy

# make db config repeated stuff reusable

```javascript
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
```

# use that getter to config the typeorm cli migration

```javascript
import { databaseConfig } from 'src/config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';

export default new DataSource({
  ...databaseConfig,
  logging: true, // Enable logging
  logger: 'advanced-console', // Advanced console logger (logs to console)
  entities: [__dirname + '/src/**/*.entity{.js,.ts}'],
  migrations: [__dirname + '/src/migrations/*{.js,.ts}'],
} as DataSourceOptions);
```

# edit local entity

```javascript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Waffle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'boolean', default: false })
  isGlutenFree?: boolean;
}
```

# add run migrations script

```json
// local entity vs db, got diff? makes one migration file, build first, so it can compare local vs db
"migration:generate": "npm run build && npx typeorm migration:generate src/migrations/$npm_config_name -d dist/typeorm-cli.config",

// run new migration files, build first, so it can run new ones (so in prod, no need to build just run the migration)
"migrate:run": "npm run build && npx typeorm migration:run -d dist/typeorm-cli.config",

// add revert in case you want to undo latest one
"migrate:revert": "npm run build && npx typeorm migration:revert -d dist/typeorm-cli.config"
```

# shortcut migration copy paste commands

```bash
npm run migration:generate --name=WriteYourMigrationNameHere
npm run migrate:run
npm run migrate:revert
```

# edit railway pre deploy cmd in gui, this will run migration above after build is done, but before running the app (before deployment)

you can only talk to private ipv6 network db only after build, so pre deploy is how railway recommend you to migrate and seed

```bash
npm run migrate:run
```

# can also remove it from gui when u do not need migration on every app build

# do not forget to update dto also

# add seed dep

```bash
npm install typeorm-extension --save
```

# make waffle factory

```javascript
// src/waffle/waffle.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { Waffle } from './entities/waffle.entity';

export default setSeederFactory(Waffle, (faker) => {
  const waffle = new Waffle();

  waffle.name = faker.lorem.words(3); // Generate a name with 3 random words
  waffle.description = faker.lorem.sentence(); // Generate a random description
  waffle.price = parseFloat(faker.commerce.price({ min: 1, max: 10, dec: 2 })); // Random price between 1 and 10
  waffle.isGlutenFree = faker.datatype.boolean(); // Random boolean for isGlutenFree
  waffle.stockQuantity = faker.number.int({ min: 0, max: 100 }); // Random stock quantity between 0 and 100
  waffle.flavor = faker.lorem.word(); // Random flavor

  return waffle;
});
```

# make waffle seeder

```javascript
// src/waffle/waffle.seeder.ts
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Waffle } from './entities/waffle.entity';

export default class WaffleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Starting Waffle Seeder...');

    // Truncate existing waffle data
    console.log('Truncating existing waffles...');
    await dataSource.query('TRUNCATE "waffle" RESTART IDENTITY;'); // Clear existing waffles
    console.log('Waffle table truncated.');

    const repository = dataSource.getRepository(Waffle);

    // Insert specific waffle data
    console.log('Inserting specific waffle data...');
    await repository.insert([
      {
        name: 'Classic Waffle',
        description: 'A classic waffle with maple syrup and butter.',
        price: 5.99,
        isGlutenFree: false,
        stockQuantity: 20,
        flavor: 'Vanilla',
      },
      {
        name: 'Choco Delight Waffle',
        description: 'Waffle topped with chocolate sauce and whipped cream.',
        price: 7.49,
        isGlutenFree: true,
        stockQuantity: 30,
        flavor: 'Chocolate',
      },
    ]);
    console.log('Specific waffle data inserted.');

    const waffleFactory = factoryManager.get(Waffle);

    // Save 1 factory-generated waffle to the database
    console.log('Saving 1 factory-generated waffle...');
    await waffleFactory.save();
    console.log('1 factory-generated waffle saved.');

    // Save 5 factory-generated waffles to the database
    console.log('Saving 5 factory-generated waffles...');
    await waffleFactory.saveMany(5);
    console.log('5 factory-generated waffles saved.');

    console.log('Waffle seeding completed.');
  }
}
```

# make seed ifee

```javascript
import { databaseConfig } from './src/config/database.config'; // must rel import outside nest
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';

const isCompiled = __dirname.includes('/dist'); // Check if running from dist/
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
```

# add seed script, run the dist js one

```json
"seed:run": "npm run build && node dist/data-source.seed"
```

# shortcut to seed - add this to railway one time to trigger seed explicitly, same like migration, remove when you are done so u dont keep seeding each push

```bash
npm run seed:run
```

# register waffle entity to parent domain

```javascript
import { Module } from '@nestjs/common';
import { WafflesService } from './waffles.service';
import { WafflesController } from './waffles.controller';
import { Waffle } from './entities/waffle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Waffle])],
  controllers: [WafflesController],
  providers: [WafflesService],
})
export class WafflesModule {}
```

# use waffle entity in serv

```javascript
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWaffleDto } from './dto/create-waffle.dto';
import { UpdateWaffleDto } from './dto/update-waffle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Waffle } from './entities/waffle.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

@Injectable()
export class WafflesService {
  constructor(
    @InjectRepository(Waffle)
    private readonly waffleRepository: Repository<Waffle>,
  ) {}
  create(createWaffleDto: CreateWaffleDto) {
    const waffle = this.waffleRepository.create(createWaffleDto);
    return this.waffleRepository.save(waffle);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.waffleRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const waffle = await this.waffleRepository.findOne({ where: { id: +id } });
    if (!waffle) {
      throw new NotFoundException(`Waffle #${id} not found`);
    }
    return waffle;
  }

  async update(id: string, updateWaffleDto: UpdateWaffleDto) {
    const waffle = await this.waffleRepository.preload({
      id: +id,
      ...updateWaffleDto,
    });
    if (!waffle) {
      throw new NotFoundException(`Waffle #${id} not found`);
    }
    return this.waffleRepository.save(waffle);
  }

  async remove(id: string) {
    const waffle = await this.findOne(id);
    return this.waffleRepository.remove(waffle);
  }
}
```

# make common dto pagination

```bash
# flat flag, if not it makes the file in a dir with that file name
nest g class common/dto/pagination-query.dto --no-spec --flat
```

```javascript
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @Type(() => Number) // dto outside body need explicit transform
  @IsOptional()
  @IsPositive()
  limit: number;

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  offset: number;
}
```

# use in cont

```javascript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { WafflesService } from './waffles.service';
import { CreateWaffleDto } from './dto/create-waffle.dto';
import { UpdateWaffleDto } from './dto/update-waffle.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

@Controller('waffles')
export class WafflesController {
  constructor(private readonly wafflesService: WafflesService) {}

  @Post()
  create(@Body() createWaffleDto: CreateWaffleDto) {
    return this.wafflesService.create(createWaffleDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.wafflesService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wafflesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWaffleDto: UpdateWaffleDto) {
    return this.wafflesService.update(id, updateWaffleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wafflesService.remove(id);
  }
}
```

# use in serv

```javascript
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWaffleDto } from './dto/create-waffle.dto';
import { UpdateWaffleDto } from './dto/update-waffle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Waffle } from './entities/waffle.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

@Injectable()
export class WafflesService {
  constructor(
    @InjectRepository(Waffle)
    private readonly waffleRepository: Repository<Waffle>,
  ) {}
  create(createWaffleDto: CreateWaffleDto) {
    const waffle = this.waffleRepository.create(createWaffleDto);
    return this.waffleRepository.save(waffle);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.waffleRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const waffle = await this.waffleRepository.findOne({ where: { id: +id } });
    if (!waffle) {
      throw new NotFoundException(`Waffle #${id} not found`);
    }
    return waffle;
  }

  async update(id: string, updateWaffleDto: UpdateWaffleDto) {
    const waffle = await this.waffleRepository.preload({
      id: +id,
      ...updateWaffleDto,
    });
    if (!waffle) {
      throw new NotFoundException(`Waffle #${id} not found`);
    }
    return this.waffleRepository.save(waffle);
  }

  async remove(id: string) {
    const waffle = await this.findOne(id);
    return this.waffleRepository.remove(waffle);
  }
}
```

# get express swag dep, auto doc rest api maker

```bash
npm install --save @nestjs/swagger swagger-ui-express
```

# create doc in entry

```javascript
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Create NestJS app
  const app = await NestFactory.create(AppModule);

  // Initialize Validation Pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // swagger api doc
  const options = new DocumentBuilder()
    .setTitle('waffle-nest-api')
    .setDescription(
      'A NestJS-powered back-end with authentication, PostgreSQL, TypeORM, and Redis. Built to showcase scalable API design and back-end architecture.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swag', app, document); // open browser thisAppDomain/api e.g. localhost:3000/api

  // Start the NestJS app
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
```

# update nest cli config to get swagger plugin - enhance ts compiler auto swag decor for u under hood

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "plugins": ["@nestjs/swagger/plugin"]
  }
}
```

# restart http listener and check doc in localhost:3000/api

# update patch dto, use swagger partial type instead

```javascript
import { PartialType } from '@nestjs/swagger';
import { CreateWaffleDto } from './create-waffle.dto';

export class UpdateWaffleDto extends PartialType(CreateWaffleDto) {}
```

# decor source code to add more info for swagger if u want

```javascript
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateWaffleDto {
  @ApiProperty({ description: 'The name of a waffle.' }) // this overrides the default, you can do this if you want
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  readonly description?: string;

  @IsNumber()
  @Min(0)
  readonly price: number;

  @IsBoolean()
  @IsOptional()
  readonly isGlutenFree?: boolean;

  @IsNumber()
  @Min(0)
  readonly stockQuantity: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  readonly flavor?: string;
}
```

# can add example err res like this too

```javascript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { WafflesService } from './waffles.service';
import { CreateWaffleDto } from './dto/create-waffle.dto';
import { UpdateWaffleDto } from './dto/update-waffle.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ApiNotFoundResponse } from '@nestjs/swagger';

@Controller('waffles')
export class WafflesController {
  constructor(private readonly wafflesService: WafflesService) {}

  @Post()
  create(@Body() createWaffleDto: CreateWaffleDto) {
    return this.wafflesService.create(createWaffleDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.wafflesService.findAll(paginationQuery);
  }

  @ApiNotFoundResponse({ description: 'Not found.' }) // err res e.g. for swag to render
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wafflesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWaffleDto: UpdateWaffleDto) {
    return this.wafflesService.update(id, updateWaffleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wafflesService.remove(id);
  }
}
```

# u can add tags too

```javascript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { WafflesService } from './waffles.service';
import { CreateWaffleDto } from './dto/create-waffle.dto';
import { UpdateWaffleDto } from './dto/update-waffle.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('waffles') // to collect them under same heading in swag render
@Controller('waffles')
export class WafflesController {
  constructor(private readonly wafflesService: WafflesService) {}

  @Post()
  create(@Body() createWaffleDto: CreateWaffleDto) {
    return this.wafflesService.create(createWaffleDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.wafflesService.findAll(paginationQuery);
  }

  @ApiNotFoundResponse({ description: 'Not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wafflesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWaffleDto: UpdateWaffleDto) {
    return this.wafflesService.update(id, updateWaffleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wafflesService.remove(id);
  }
}
```

# create users res

```bash
nest g res users
```

# edit user serv to prevent eslint err

```javascript
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return createUserDto;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
```

# make user entity and register to parent module (so typeorm knows this exists & make auto repo)

```javascript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
```

```javascript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

# create migration file and run migration (make sure remote railway also does it, it should have it in pre deploy script)

```bash
npm run migration:generate --name=AddUser
npm run migrate:run
git add .
git commit -m "feat: add user"
git push
```

# get bcrypt js

```bash
npm i bcryptjs
npm install --save @types/bcryptjs -D
```

# make iam mod

```bash
nest g module iam
nest g service iam/hashing
```

# make hash serv

```javascript
import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcryptjs';

@Injectable()
export class HashingService {
  async hash(data: string): Promise<string> {
    const salt = await genSalt();
    return hash(data, salt);
  }

  compare(data: string, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
```

# make auth cont serv for iam domain

```bash
nest g controller iam/authentication
nest g service iam/authentication
```

# make sign in and up dto

```bash
nest g class iam/authentication/dto/sign-in.dto --flat
nest g class iam/authentication/dto/sign-up.dto --flat
```

```javascript
import { IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;
}

import { IsEmail, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;
}
```

# inject user repo to auth serv

when u wanna use someone else repo just inject repo immediately in mod

```javascript
import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [HashingService, AuthenticationService],
  controllers: [AuthenticationController],
})
export class IamModule {}
```

```javascript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user = new User();
    user.email = signUpDto.email;
    user.password = await this.hashingService.hash(signUpDto.password);

    await this.usersRepository.save(user);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }
    // TODO: We'll fill this gap in the next lesson
    return true;
  }
}
```

# update auth cont

```javascript
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
```

# remove all spec file, i do not want to test

```javascript
find . -type f -name "*.spec.ts" -delete
```
