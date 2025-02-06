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

# whenever you npm i, restart eslint, reload window

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

# before commit run lint and format

```bash
npm run lint
npm run format
```
