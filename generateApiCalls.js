const yaml = require('js-yaml');
const fs = require('fs');

const generateApi = (inputFile, outputFileName) => {
  outputFileName = outputFileName ? outputFileName : 'apiCalls.js';
  console.log(`Started generating apiCalls.js from ${inputFile}`);
  try {
    const obj = yaml.safeLoad(fs.readFileSync(inputFile, {encoding: 'utf-8'}))
    const workFlowControllerString = `var WorkFlowController = require('./services/workflowController')\nvar workFlowController = new WorkFlowController("http://localhost:3001")\n\n`;

    const readModels = obj.Contexts[0].Readmodels.map(r => ({name: r.Readmodel.Name, key: r.Readmodel.Key}));
    const fetchJS = getFetchString(readModels);

    const allCommands = obj.Contexts[0].Streams.map(s => s.Commands.map(c => ({
      streamName: s.Stream,
      commandName: c.Command.Name,
      commandParameters: c.Command.Parameters.map(p => ({name: p.Name}))
    })));
    const postJS = getPostString(allCommands);
    const outputFile = `./output/${outputFileName}.js`;
    fs.writeFileSync(outputFile, workFlowControllerString + fetchJS + "\n" + postJS);
    console.log(`Success. See ${outputFile}`);
  } catch (err) {
    console.log('Oops. Something went wrong.');
    console.log(err);
  }
};

const getFetchString = readModels => {
  let fetchOneString = '';
  let fetchAllString = '';
  readModels.forEach(rm => {
    fetchOneString += `const fetch${rm.name}API = async ${rm.key} => await workFlowController.findOne("${rm.name}", {${rm.key}}) \n`;
    fetchAllString += `const fetchAll${rm.name}API = async () => await workFlowController.findWhere("${rm.name}", {}) \n`;
  });
  return fetchAllString + '\n' + fetchOneString
};

const getPostString = commands => {
  let allCommandString = '';
  commands.forEach(stream => {
    stream.forEach(c => {
      let parameterString = '';
      c.commandParameters.forEach((p, i) => {
        const comma = i === (c.commandParameters.length - 1) ? '' : ', ';
        parameterString += p.name + comma
      });
      const idParameter = c.commandParameters.find(p => p.name.toLowerCase().endsWith('id')).name;
      allCommandString += `const ${c.commandName}API = async (${parameterString}) => await workFlowController.execute("${c.streamName}","${c.commandName}",{${parameterString}})
const ${c.commandName} = async (${parameterString}) => {
  try {
    const handledCommand = await ${c.commandName}${c.streamName}API(${parameterString})
    const ${c.streamName} = await fetch${c.streamName}API(handledCommand.${idParameter})
    return ${c.streamName}
  } catch (err) {
    throw(err)
  }
}\n\n`;
    })
  });
  return allCommandString;
};


module.exports = generateApi;
