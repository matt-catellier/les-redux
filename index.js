var inputfile = __dirname + '/samples/helloworld/Emlfile.yaml',
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

const readModels = obj.Contexts[0].Readmodels.map(rm => rm)

const fileName = obj.Contexts[0].Streams[0].Stream
const redux = {fileName, commands, readModels}

console.log(JSON.stringify(redux))

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
// this code if you want to save
// fs.writeFileSync(outputfile, JSON.stringify(obj, null, 2));

// JS DOESN'T CARE ABOUT TYPE!
// {"name":"SayHelloWorld","parameters":[{"name":"helloworldId","type":"string"}]}

// turn into redux action

/*
action creator

function sayHelloWorld(helloworldId) {
    return {
        type : "SAY_HELLO_WORLD",
        payload: { helloworldId }
    }
}

`function sayHelloWorld(helloworldId) {
    return {
        type : "SAY_HELLO_WORLD",
        payload: { helloworldId }
    }
}`
 */
const funcString =
  `function sayHelloWorld(helloworldId) {
    return {
        type : "SAY_HELLO_WORLD",
        payload: { helloworldId }
    }
  }`