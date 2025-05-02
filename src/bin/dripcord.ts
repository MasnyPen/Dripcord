#!/usr/bin/env node

import {spawn} from "child_process";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import {DripcordFramework} from "../DripcordFramework.js";
import chokidar from 'chokidar';

const [,, command] = process.argv;
async function main() {
    switch (command) {
        case 'dev':
            console.info('🚀 Starting dev server...');

            let child = new DripcordFramework(true)
            const watcher = chokidar.watch('src', { ignoreInitial: true });
            watcher.on('all', (event, path) => {
                console.log(`🔄 ${event} detected at ${path}, restarting…`);
                child.end();
                child = new DripcordFramework(true);
            });
            break;
        case 'start':
            console.info('🔥 Starting server...');
            new DripcordFramework(false)
            break;
        case 'build':
            console.info('🔨  Building Discord bot...');
            const buildProcess = spawn('tsc', ['--build'], {
                stdio: 'inherit',
                shell: true
            });

            buildProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`❌  Build failed with code ${code}`);
                } else {
                    console.info('✅  Build completed successfully!');
                }
            });
            break;

        case 'lint':
            console.info('🧹 Running Biome linter...');
            const lintProcess = spawn('npx', ['biome', 'check', '.'], {
                stdio: 'inherit',
                shell: true
            });

            lintProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`❌ Linting failed with code ${code}`);
                } else {
                    console.info('✅ Linting completed successfully.');
                }
            });
            break;
        case 'init':
            console.info(chalk.blue('🛠  Dripcord Init - Starting...'));

            const answers = await inquirer.prompt([
                {type: "input", name: "projectName", message: "📛 Project name:", default: "dripcord-bot"},
                {
                    type: "list",
                    name: "language",
                    message: "🧠 Language:",
                    choices: ["TypeScript", "JavaScript"],
                    default: "TypeScript"
                },
                {
                    type: "confirm",
                    name: "useSharding",
                    message: "🧩 Enable sharding?",
                    default: false
                }
            ]);

            const useTS = answers.language === 'TypeScript';
            const ext = useTS ? 'ts' : 'js';

            const projectRoot = path.resolve(process.cwd(), answers.projectName);
            if (fs.existsSync(projectRoot)) {
                console.error(chalk.red('❗ Project folder already exists.'));
                process.exit(1);
            }
            fs.mkdirSync(projectRoot);

            const srcDir = path.join(projectRoot, 'src');
            fs.mkdirSync(srcDir, {recursive: true});
            fs.mkdirSync(path.join(srcDir, 'commands'), {recursive: true});
            fs.mkdirSync(path.join(srcDir, 'events'), {recursive: true});
            fs.mkdirSync(path.join(srcDir, 'plugins'), {recursive: true});


            fs.writeFileSync(path.join(srcDir, 'commands', `ping.${ext}`),
                `import { Command } from "dripcord";
import { ${ useTS ? "ChatInputCommandInteraction, " : ""}SlashCommandBuilder } from 'discord.js';

export default class Ping extends Command {
    constructor() {
        super(new SlashCommandBuilder().setName("ping"), false)
    }

    async execute(i${useTS ? ": ChatInputCommandInteraction" : ""}) {
        await i.reply("Pong!")
    }
};`);

            fs.writeFileSync(path.join(srcDir, 'events', `ready.${ext}`),
                `import { Event } from "dripcord"
import { Events, Client } from 'discord.js'

export default class ClientEvent extends Event {
    constructor() {
        super(Events.ClientReady, true)
    }
    async execute(client${useTS ?": Client" : ""}) {
        console.log("Bot has started")
    }
}`);


            fs.writeFileSync(path.join(projectRoot, 'config.js'),
                `// Auto-generated config.js
import { LocalCacheDriver, SQLiteDatabaseDriver } from "dripcord";

export default {
  dev: {
    developers: []
  },
  cache: new LocalCacheDriver(),
  database: new SQLiteDatabaseDriver(),
  eventsDir: "./${useTS ? "dist/" : "src/"}events",
  commandsDir: "./${useTS ? "dist/" : "src/"}commands",
  pluginsDir: "./${useTS ? "dist/" : "src/"}plugins",
  i18n: {
    default: "en",
    locales: ["en"]
  },
  shards: { 
    enabled: ${answers.useSharding}, 
    totalShards: "auto"
  }
};`);

            fs.writeFileSync(path.join(projectRoot, '.env'),
                `TOKEN=your-bot-token-here
CLIENT_ID=client-id-here
                `);

            fs.writeFileSync(path.join(projectRoot, 'biome.json'),
                `{
      "files": { "ignore": ["node_modules/**"] },
      "formatter": { "enabled": true }
    }`);

            if (useTS) {
                fs.writeFileSync(path.join(projectRoot, 'tsconfig.json'),
                    `{
      "compilerOptions": {
        "target": "ES2020",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "esModuleInterop": true,
        "outDir": "dist",
        "rootDir": "src",
        "strict": true,
        "skipLibCheck": true
      }
    }`);
            }
            if (answers.useSharding) {
                fs.writeFileSync(path.join(projectRoot, 'shard.js'),
                    `import { initShard } from 'dripcord'
initShard()`)
            }

            console.info(chalk.yellow('📦 Running npm init...'));
            fs.writeFileSync(path.join(projectRoot, 'package.json'), `
{
  "name": "${answers.projectName}",
  "version": "1.0.0",
  "main": "config.js",
  "scripts": {
    "start": "dripcord start",
    "dev": "dripcord dev",
    ${useTS ? '"build": "dripcord build",' : ''}
    "lint": "dripcord lint"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}`)

            await new Promise(resolve => setTimeout(resolve, 1000));

            console.info(chalk.yellow('📦 Installing dependencies...'));
            spawn('npm', ['install', 'dripcord', 'discord.js@14.19.2'], {cwd: projectRoot, stdio: 'inherit', shell: true});

            const devDeps = ['@biomejs/biome'];
            if (useTS) devDeps.push('typescript');

            spawn('npm', ['install', '--save-dev', ...devDeps], {cwd: projectRoot, stdio: 'inherit', shell: true});

            console.info(chalk.green('✅ All files created!'));
            console.info(chalk.cyan('✨ Now run:'));
            console.info(chalk.cyan(`cd ${answers.projectName}`));
            break;
        default:
            console.info(`❓ Unknown command: ${command}`);
            console.info('Available commands: dev, start, build, lint, init');
    }
}
main()
