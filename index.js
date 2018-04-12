var inputfile = __dirname + '/samples/inventory/Emlfile.yaml',
    yaml = require('js-yaml'),
    fs = require('fs'),
    obj = yaml.safeLoad(fs.readFileSync(inputfile, {encoding: 'utf-8'}));


String.prototype.toCamelCase = function() {
  return this
    .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
    .replace(/\s/g, '')
    .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
}

console.log(obj)

const commands = obj.Contexts[0].Streams[0].Commands.map(c =>
  ({
    name: c.Command.Name,
    parameters: c.Command.Parameters.map(p => ({name: p.Name}))
  })
)


const readmodels = obj.Contexts[0].Readmodels.map(r => ({name: r.Readmodel.Name, key: r.Readmodel.Key}))
console.log(readmodels)

let fetchOneString = ''
let fetchAllString = ''
readmodels.forEach((rm, i) => {
  fetchOneString += `const fetch${rm.name}API = async ${rm.key} => await workflowController.findOne("${rm.name}", {${rm.key}}) \n`
  fetchAllString += `const fetch${rm.name}API = async () => await workflowController.findWhere("${rm.name}", {}) \n`
})

console.log(fetchOneString)
fs.writeFileSync('fetchOneApi.js', fetchOneString);
fs.writeFileSync('fetchAllApi.js', fetchAllString);

const commandFunctions = commands.map((command) => {
  let parametersString = ''
  command.parameters.forEach((p,i) => {
    const separator = i !== command.parameters.length - 1 ? " ," : ''
    parametersString += p.name + separator
  })
  const funcString =
    `function ${command.name.toCamelCase()}(${parametersString}) {
    return {
        type : "${command.name.toUpperCase()}",
        payload: { ${parametersString} }
    }
  }
  `
  return funcString
})

console.log(commandFunctions)
fs.writeFileSync('actions.js', commandFunctions);

/* TRYING TO MAKE string for all this
const createLocation = async (locationName, address) => {
  try {
    const handledCommand = await createLocationAPI(locationName, address)
    const location = await fetchLocationAPI(handledCommand.locationId)
    return location
  } catch (err) {
    throw(err)
  }
}
*/