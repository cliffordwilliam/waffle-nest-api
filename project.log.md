# why use nest

```
enterprise grade
focus on app, not config

```

# get node lts, nest cli globally, make nest app --no-spec

```bash
nvm install --lts
nvm use --lts
node -v
npm i -g @nestjs/cli
nest ne --no-specw --no-spec
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

````bash
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
````

# create waffle resource

```bash
nest g resource --no-spec
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

# migrate

```bash
npm run migration:generate --name=AddRole
npm run migrate:run
git add .
git commit
git push
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

// cli does not work so use iife
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
nest g res users --no-spec
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
nest g module iam --no-spec
nest g service iam/hashing --no-spec
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
nest g controller iam/authentication --no-spec
nest g service iam/authentication --no-spec
```

# make sign in and up dto

```bash
nest g class iam/authentication/dto/sign-in.dto --flat --no-spec
nest g class iam/authentication/dto/sign-up.dto --flat --no-spec
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

# change railway jwt issuer env to its private domain

```
JWT_TOKEN_AUDIENCE=https://frontend1.com,https://frontend2.com
JWT_TOKEN_ISSUER="asd-asd-asd.railway.internal"
```

# get jwt dep

```bash
npm i @nestjs/jwt --no-spec
```

# create config dir in iam, make jwt.config.ts

```javascript
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  // Ensure essential variables are set, otherwise throw an error
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing');
  }

  const audience = process.env.JWT_TOKEN_AUDIENCE;
  if (!audience) {
    throw new Error('JWT_TOKEN_AUDIENCE environment variable is missing');
  }

  const issuer = process.env.JWT_TOKEN_ISSUER;
  if (!issuer) {
    throw new Error('JWT_TOKEN_ISSUER environment variable is missing');
  }

  return {
    secret,
    audience,
    issuer,
  };
});
```

# register jwt mod to iam mod, also get user repo and jwt config to inject in iam mod members

```javascript
import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [HashingService, AuthenticationService],
  controllers: [AuthenticationController],
})
export class IamModule {}
```

# make const for token ttl

```javascript
export const REQUEST_USER_KEY = 'user';
export const JWT_ACCESS_TOKEN_TTL = 300;
export const JWT_REFRESH_TOKEN_TTL = 3600;
```

# give token on ok sign in

```javascript
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersRepository.findOneBy({
      email: signUpDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
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
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: JWT_ACCESS_TOKEN_TTL,
      },
    );
    return {
      accessToken,
    };
  }
}
```

# make payload interface

```javascript
// src/iam/interfaces/active-user-data.interface.ts
export interface ActiveUserData {
  sub: number; // user ID
  email: string;
}
```

# make const

```javascript
// src/iam/iam.constants.ts
export const REQUEST_USER_KEY = 'user';
```

# make auth guard, no token no access

```bash
nest g guard iam/authentication/guards/access-token --no-spec --flat --no-spec
```

```javascript
// src/iam/authentication/guards/access-token.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/iam/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: ActiveUserData = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

# register guard global in iam mod

```javascript
import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    HashingService,
    AuthenticationService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
```

# make pub decor

```javascript
// src/iam/decorators/auth.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

# token guard try to grab decor val, if true then pass free

```javascript
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/iam/config/jwt.config';
import { IS_PUBLIC_KEY } from 'src/iam/decorators/auth.decorator';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: ActiveUserData = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

```

# decor sign in and sign up with pub

```javascript
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from '../decorators/auth.decorator';

@Public()
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

# add decor to grab active user payload from request

```javascript
// src/iam/decorators/active-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../iam.constants';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { Request } from 'express';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as ActiveUserData | undefined;
    return field ? user?.[field] : user;
  },
);

```

# use it to get me

```javascript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  findMe(@ActiveUser() user: ActiveUserData) {
    return this.usersService.findOne(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
```

# update auth service, give refresh token with access token

```javascript
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenData } from '../interfaces/refresh-token-data.interface';
import { JWT_ACCESS_TOKEN_TTL, JWT_REFRESH_TOKEN_TTL } from '../iam.constants';
import { randomUUID } from 'crypto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersRepository.findOneBy({
      email: signUpDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
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
    return await this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    // all token needs user sub at least
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(
        {
          sub: user.id,
          email: user.email,
        } as ActiveUserData,
        JWT_ACCESS_TOKEN_TTL,
      ),
      this.signToken(
        {
          sub: user.id,
          refreshTokenId,
        } as RefreshTokenData,
        JWT_REFRESH_TOKEN_TTL,
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(payload: T, expiresIn: number) {
    const token = await this.jwtService.signAsync(
      payload as ActiveUserData | RefreshTokenData,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn, // access token or refresh token
      },
    );
    return token;
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub }: RefreshTokenData = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration,
      );
      const user = await this.usersRepository.findOneByOrFail({
        id: sub,
      });
      return this.generateTokens(user);
    } catch {
      // fail to read token or user don't exist in token
      throw new UnauthorizedException();
    }
  }
}

```

# create refresh token endpoint

```javascript
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from './decorators/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Public()
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

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}

```

# [install redis locally](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux/)

# start redis locally

```bash
# start redis
sudo systemctl start redis-server

# stop redis
sudo systemctl stop redis-server
```

# test ping pong

```bash
redis-cli PING
```

# get ioredis dep (redis client)

```bash
npm i ioredis
```

# make redis provider, to stores refresh token in redis

```bash
# flat flag, if not it makes the file in a dir with that file name
nest g class iam/authentication/refresh-token-ids.storage --no-spec --flat
```

```javascript
import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  UnauthorizedException,
} from '@nestjs/common';
import Redis from 'ioredis';
import redisConfig from '../config/redis.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  constructor(
    @Inject(redisConfig.KEY)
    private readonly redisConfiguration: ConfigType<typeof redisConfig>,
  ) {}

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: this.redisConfiguration.host,
      port: this.redisConfiguration.port,
      password: this.redisConfiguration.password,
      family: 0, // force ipv4
    });
  }

  onApplicationShutdown() {
    return this.redisClient.quit();
  }

  async insert(userId: number, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this.getKey(userId));
    if (storedId !== tokenId) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }

  async invalidate(userId: number): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}

```

# use it in auth serv to invalidate refresh token

```javascript
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenData } from '../interfaces/refresh-token-data.interface';
import { JWT_ACCESS_TOKEN_TTL, JWT_REFRESH_TOKEN_TTL } from '../iam.constants';
import { randomUUID } from 'crypto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersRepository.findOneBy({
      email: signUpDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
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
    return await this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    // all token needs user sub at least
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(
        {
          sub: user.id,
          email: user.email,
        } as ActiveUserData,
        JWT_ACCESS_TOKEN_TTL,
      ),
      this.signToken(
        {
          sub: user.id,
          refreshTokenId,
        } as RefreshTokenData,
        JWT_REFRESH_TOKEN_TTL,
      ),
    ]);
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId); // remember tiket given out
    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(payload: T, expiresIn: number) {
    const token = await this.jwtService.signAsync(
      payload as ActiveUserData | RefreshTokenData,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn, // access token or refresh token
      },
    );
    return token;
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId }: RefreshTokenData =
        await this.jwtService.verifyAsync(
          refreshTokenDto.refreshToken,
          this.jwtConfiguration,
        );
      const user = await this.usersRepository.findOneByOrFail({
        id: sub,
      });
      // check if user holds tiket that i just gave them
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id); // burn old tiket
      } else {
        throw new Error('Refresh token is invalid'); // ur tiket is fake
      }
      return this.generateTokens(user);
    } catch {
      // fail to read token or user don't exist in token
      throw new UnauthorizedException();
    }
  }
}

```

# update redis env for the web server service in railway gui first

# then push this new commit with the redis on app ready connection

# add user role and migrate

# add user role enum

```javascript
export enum Role {
  Regular = 'regular',
  Admin = 'admin',
}
// src/users/enums/role.enum.ts
```

# add repl

```javascript
import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  await repl(AppModule);
}
void bootstrap();
```

# use repl to add role value

```bash
npm run start -- --entryFile repl

await get('UserRepository').update({ id: 1 }, { role: 'regular' });
await get("UserRepository").find()

# ctrl + c twice to exit
```

# create new dir iam/authorization/decorators/role.decorator.ts

```javascript
import { SetMetadata } from '@nestjs/common';
import { Role } from '../../../users/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

```

# make new role guard

```bash
nest g guard iam/authorization/guards/roles --no-spec --flat --no-spec
```

```javascript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/enums/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as ActiveUserData | undefined;
    return requiredRoles.some((role) => user?.role === role);
  }
}

```

# use guard

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
import { Roles } from 'src/iam/authorization/decorators/role.decorator';
import { Role } from 'src/users/enums/role.enum';

@ApiTags('waffles')
@Controller('waffles')
export class WafflesController {
  constructor(private readonly wafflesService: WafflesService) {}

  @Roles(Role.Admin)
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

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWaffleDto: UpdateWaffleDto) {
    return this.wafflesService.update(id, updateWaffleDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wafflesService.remove(id);
  }
}
```

# in case u want docker, create yaml

```yaml
# docker-compose.yml
version: '3'
services:
  db:
    image: postgres
    restart: always
    ports:
      - '5432:5432'
    environment:
      POSTGRES_PASSWORD: pass123

  redis:
    image: redis
    restart: always
    ports:
      - '6379:6379'
```

# make sure to use POSTGRES_PASSWORD: pass123 in ur env when connecting to it then

```
DATABASE_HOST="localhost"
DATABASE_NAME="postgres"
DATABASE_PASSWORD="pass123"
DATABASE_PORT="5432"
DATABASE_TYPE="postgres"
DATABASE_USER="postgres"

REDIS_HOST="localhost"
REDIS_PASSWORD="redispass"
REDIS_PORT="6379"
```

# install docker desktop, its super easy on windows

install docker from here

https://docs.docker.com/desktop/setup/install/windows-install/

restart comp

had a bios update

then docker comes up

had to accept agreement

Docker Subscription Service Agreement
By selecting accept, you agree to the Subscription Service Agreement⁠, the Docker Data Processing Agreement⁠, and the Data Privacy Policy⁠.

Commercial use of Docker Desktop at a company of more than 250 employees OR more than $10 million in annual revenue requires a paid subscription (Pro, Team, or Business). See subscription details⁠

then use the recommended settings

then had to allow it made changes to machine

and sign in with github

# then leave it on, and run this in any terminal (make sure in popup let it be in private network only, its in firewall advanced popup accordion)

# Start containers in bg mode

```bash
docker-compose up -d
```

# Stop containers

```bash
docker-compose up -d
```

# can install the docker vs code extension too to see containers

# git cloning this from another machine and npm i gives me warnings with nest jest

```bash
$ npm i
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
```

# do not forget to migrate / seed that docker container postgre

```bash
npm run migration:generate --name=WriteYourMigrationNameHere
npm run migrate:run
npm run migrate:revert

npm run seed:run
```

# window line ending diff (ori proj in linux, u commit and push in windows)

Run the following command to set Git to automatically normalize line endings

```bash
git config --global core.autocrlf true

```

After setting the config, you need to normalize the files

```bash
git rm --cached -r .
git reset --hard
```

# enforce consistent line endings in all os, make this in root .gitattributes in repo

This ensures that Git handles line endings correctly based on the OS

```
* text=auto
```
