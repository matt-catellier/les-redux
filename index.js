const fs = require('fs');
const generateApi = require('./generateApiCalls')

const inputfile = __dirname + '/samples/consentaur/Emlfile.yaml';
generateApi(inputfile, 'consentaur');