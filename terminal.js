#!/usr/bin/env node
const program = require('commander');
const generateApiCalls = require('./generateApiCalls');

program
  .version('0.1.0', '-v, --version')
  .description('Create file with all api calls based on eml')

program
  .command('api-calls <file> <name>')
  .description('Generate js to make all api calls')
  .option('-n --name', 'Output filename')
  .description('Create js file with all api calls')
  .parse(process.argv)
  .action((file, name) => {
    generateApiCalls(file, name)
  })

program.parse(process.argv);
