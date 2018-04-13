#!/usr/bin/env node
const program = require('commander');
const generateApiCalls = require('./generateApiCalls');

program
  .version('0.1.0', '-v, --version')

program
  .command('api-calls <file>')
  .description('Create js file with all api calls')
  .parse(process.argv)
  .action(file => {
    generateApiCalls(file)
  })

program.parse(process.argv);
