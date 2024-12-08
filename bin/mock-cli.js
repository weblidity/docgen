const { Command } = require('commander');
const fs = require('fs');
const program = new Command();

program
  .name('my-cli')
  .description('A CLI tool for various tasks')
  .version('1.0.0');

program
  .command('greet <name>')
  .description('Greet a person')
  .action((name) => {
    console.log(`Hello, ${name}!`);
  });

program
  .command('farewell <name>')
  .description('Bid farewell to a person')
  .action((name) => {
    console.log(`Goodbye, ${name}!`);
  });



program.parse(process.argv);
