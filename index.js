var inputfile = __dirname + '/samples/veggiesgalore/Emlfile.yaml',
    yaml = require('js-yaml'),
    fs = require('fs'),
    obj = yaml.load(fs.readFileSync(inputfile, {encoding: 'utf-8'}));


String.prototype.toCamelCase = function() {
  return this
    .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
    .replace(/\s/g, '')
    .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
}

const commands = obj.Contexts[0].Streams[0].Commands.map(command =>
  ({
    name: command.Command.Name,
    parameters: command.Command.Parameters.map(p => ({name: p.Name}))
  })
)
const functions = commands.map((command) => {
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

console.log(functions)
fs.writeFileSync('actions.js', functions);

/* TRYING TO MAKE string for all this
const fetchLocationAPI = async locationId => await workflowController.findOne("location", {locationId})
const createLocationAPI = async (locationName, address) => await workflowController.create("location", {locationName, address})
const createLocation = async (locationName, address) => {
  try {
    const handledCommand = await createLocationAPI(locationName, address)
    const location = await fetchLocationAPI(handledCommand.locationId)
    return location
  } catch (err) {
    throw(err)
  }
}