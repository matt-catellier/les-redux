var inputfile = __dirname + '/samples/inventory/Emlfile.yaml',
    yaml = require('js-yaml'),
    fs = require('fs'),
    obj = yaml.safeLoad(fs.readFileSync(inputfile, {encoding: 'utf-8'})),
    importWorkflowController =
      `var WorkFlowController = require('./services/workflowController')\nvar workFlowController = new WorkFlowController()\n\n`;

String.prototype.toCamelCase = function() {
  return this
    .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
    .replace(/\s/g, '')
    .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
};
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const readmodels = obj.Contexts[0].Readmodels.map(r => ({name: r.Readmodel.Name.toCamelCase(), key: r.Readmodel.Key.toCamelCase()}));
const getFetchString = readmodels => {
  let fetchOneString = '';
  let fetchAllString = '';
  readmodels.forEach(rm => {
    fetchOneString += `const fetch${rm.name.toCamelCase()}API = async ${rm.key.toCamelCase()} => await workFlowController.findOne("${rm.name.toCamelCase()}", {${rm.key.toCamelCase()}}) \n`;
    fetchAllString += `const fetchAll${rm.name.toCamelCase()}API = async () => await workFlowController.findWhere("${rm.name.toCamelCase()}", {}) \n`;
  });
  return fetchAllString + '\n' + fetchOneString
};

const fetchJS = getFetchString(readmodels);

const allCommands = obj.Contexts[0].Streams.map(s => s.Commands.map(c => ({streamName: s.Stream, commandName: c.Command.Name.toCamelCase(), commandParameters: c.Command.Parameters.map(p => ({name: p.Name.toCamelCase()}))}))[0]);
const getPostString = commands => {
  let allCommandString = '';
  commands.forEach(c => {
    let parameterString = '';
    c.commandParameters.forEach((p,i) => {
      const comma = i === (c.commandParameters.length - 1) ? '' : ', ';
      parameterString += p.name.toCamelCase() + comma
    });
    const idParameter = c.commandParameters.find(p => p.name.toLowerCase().endsWith('id')).name.toCamelCase();
    allCommandString += `const create${c.streamName}API = async (${parameterString}) => await workFlowController.create("${c.streamName}", {${parameterString}})
const create${c.streamName} = async (${parameterString}) => {
  try {
    const handledCommand = await create${c.streamName}API(${parameterString})
    const ${c.streamName.toCamelCase()} = await fetch${c.streamName}API(handledCommand.${idParameter})
    return ${c.streamName.toCamelCase()}
  } catch (err) {
    throw(err)
  }
}\n`;
  });
  return allCommandString
};

const postJS = getPostString(allCommands);
fs.writeFileSync('apiCalls.js', importWorkflowController + fetchJS + "\n" + postJS);