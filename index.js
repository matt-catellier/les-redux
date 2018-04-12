var inputfile = __dirname + '/samples/helloworld/Emlfile.yaml',
    yaml = require('js-yaml'),
    fs = require('fs'),
    obj = yaml.load(fs.readFileSync(inputfile, {encoding: 'utf-8'}));

// const commands = obj.Contexts.Streams[0].Commands.map(command => {
//   return {name: command.name, parameters: command.Parameters}
// })

const commands = obj.Contexts[0].Streams[0].Commands.map(command => {
  const formattedCommand = {
    name: command.Command.Name,
    parameters: command.Command.Parameters.map(p => {
      const parameter = {
        name: p.Name,
        type: p.Type,
      }
      return parameter
    })
  }
  return formattedCommand
})

const readModels = obj.Contexts[0].Readmodels.map(rm => rm)

const redux = {commands, readModels}
console.log(JSON.stringify(redux))
// this code if you want to save
// fs.writeFileSync(outputfile, JSON.stringify(obj, null, 2));
