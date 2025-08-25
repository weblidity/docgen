const { exec } = require('child_process');
const path = require('path');

const cliPath = path.resolve(__dirname, '../src/index.js');


describe('CLI Tests', () => {
  // Test case for running with no arguments
  test('should display help message when run with no arguments', (done) => {
    exec(`node "${cliPath}"`, (error, stdout, stderr) => {
      console.log('STDOUT:', stdout);
      expect(stderr.trim()).toContain('Usage: prodpage [options] [command]');
      expect(stdout).toBe('');
      done();
    });
  });
});


  // // Test case for -h option
  // test('should display help message when -h option is used', (done) => {
  //   exec(`node ${cliPath} -h`, (error, stdout, stderr) => {
  //     expect(stdout).toContain('Usage: prodpage [options] [command]');
  //     expect(error).toBeNull();
  //     done();
  //   });
  // });

  // // Test case for --help option
  // test('should display help message when --help option is used', (done) => {
  //   exec(`node ${cliPath} --help`, (error, stdout, stderr) => {
  //     expect(stdout).toContain('Usage: prodpage [options] [command]');
  //     expect(error).toBeNull();
  //     done();
  //   });
  // });

  // // Test case for -V option
  // test('should display version when -V option is used', (done) => {
  //   exec(`node ${cliPath} -V`, (error, stdout, stderr) => {
  //     // Assuming version is in package.json and accessible
  //     const packageJson = require('../package.json');
  //     expect(stdout).toContain(packageJson.version);
  //     expect(error).toBeNull();
  //     done();
  //   });
  // });

  // // Test case for --version option
  // test('should display version when --version option is used', (done) => {
  //   exec(`node ${cliPath} --version`, (error, stdout, stderr) => {
  //     const packageJson = require('../package.json');
  //     expect(stdout).toContain(packageJson.version);
  //     expect(error).toBeNull();
  //     done();
  //   });
  // });

