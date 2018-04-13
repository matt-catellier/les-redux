const fs = require('fs');
const generateApi = require('./generateApiCalls')

const inputfile = __dirname + '/samples/inventory/Emlfile.yaml';
generateApi(inputfile);