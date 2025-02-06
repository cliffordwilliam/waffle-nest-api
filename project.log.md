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

# before commit run lint and format all

```bash
npm run lint
npm run format
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

# deploy to railway

```
pay for hobby plan
go to railway dashboard
create new project
deploy from github repo
generate domain for backend service
```

# create waffle resource

```bash
nest g resource
```

# get husky

```bash
npm install --save-dev husky
```

# update husky pre commit (.husky/pre-commit)

```
npm run lint
npm run format
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
