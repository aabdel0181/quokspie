import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const config = require('./config.json');

console.log(config);
