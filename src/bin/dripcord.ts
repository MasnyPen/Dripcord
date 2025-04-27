#!/usr/bin/env node

import {DripcordFramework} from "../DripcordFramework.js";

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
        console.info("soon")
        break;
    default:
        console.info(`❓ Unknown command: ${command}`);
        console.info('Available commands: dev, start, lint');
}
