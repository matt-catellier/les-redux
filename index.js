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

let fetchOneString = '';
let fetchAllString = '';
readmodels.forEach(rm => {
  fetchOneString += `const fetch${rm.name}API = async ${rm.key} => await workFlowController.findOne("${rm.name}", {${rm.key}}) \n`;
  fetchAllString += `const fetchAll${rm.name}API = async () => await workFlowController.findWhere("${rm.name}", {}) \n`;
});

const fetchJS = fetchAllString + '\n' + fetchOneString

const commands = obj.Contexts[0].Streams[0].Commands.map(c =>
  ({name: c.Command.Name.toCamelCase(), parameters: c.Command.Parameters.map(p => ({name: p.Name.toCamelCase()}))})
);
console.log(JSON.stringify(commands));

let commandString = '';
const streamName = obj.Contexts[0].Streams[0].Stream.toCamelCase();
commands.forEach(c => {
  let parameterString = '';
  c.parameters.forEach((p,i) => {
    const comma = i === (c.parameters.length - 1) ? '' : ', ';
    parameterString += p.name.toCamelCase() + comma
  })
  const idParameter = c.parameters.find(p => p.name.toLowerCase().endsWith('id')).name.toCamelCase();
  console.log(parameterString);
  console.log(idParameter);
  const entity = streamName.capitalize()
  commandString += `const create${entity}API = async (${parameterString}) => await workFlowController.create("${streamName}", {${parameterString}})
const create${entity} = async (${parameterString}) => {
  try {
    const handledCommand = await create${entity}API(${parameterString})
    const entity = await fetch${entity}API(handledCommand.${idParameter})
    return entity
  } catch (err) {
    throw(err)
  }
}\n`;
});
const commandJS = commandString

fs.writeFileSync('createCommands.js', importWorkflowController + commandJS);
fs.writeFileSync('fetchReadmodels.js', importWorkflowController + fetchJS);
fs.writeFileSync('actions.js', importWorkflowController + fetchJS + "\n" + commandJS);