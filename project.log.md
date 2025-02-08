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

# add repl in src/repl.ts

```javascript
import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  await repl(AppModule);
}
void bootstrap();
```
