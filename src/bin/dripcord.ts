#!/usr/bin/env node

import {DripcordFramework} from "../DripcordFramework.js";
import {spawn} from "child_process";

const [,, command] = process.argv;

switch (command) {
    case 'dev':
        console.info('🚀 Starting dev server...');
        new DripcordFramework(true).build();
        break;
    case 'start':
        console.info('🔥 Starting server...');
        new DripcordFramework(false).build()
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
    default:
        console.info(`❓ Unknown command: ${command}`);
        console.info('Available commands: dev, start, lint');
}
