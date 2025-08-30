<p align="center">
  <a href="">
 <img width=200px height=200px src="https://i.imgur.com/0Axr7in.jpg" alt="prodpage-cli Project Logo"></a>
</p>

<h1 align="center">Prodpage CLI</h1>
<h2 align="center">Code name: <code>prodpage</code></h2>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com/weblidity/prodpage-cli)
[![NPM Version](https://img.shields.io/npm/v/prodpage-cli)](https://www.npmjs.com/package/prodpage-cli)
[![GitHub Issues](https://img.shields.io/github/issues/weblidity/prodpage-cli.svg)](https://github.com/weblidity/prodpage-cli/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/weblidity/prodpage-cli.svg)](https://github.com/weblidity/prodpage-cli/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

## Description

`prodpage-cli` is a command-line interface tool that generates documentation files and folders for multiple projects on a Docusaurus-powered site.

## Features

- **Documentation Scaffolding**: Build files and folders for company product documentation structure for a Docusaurus-powered site.
- **Configuration Management**: Create and manage configuration files for the CLI.

## Installation

```bash
npm install prodpage-cli -g
```

## Usage

```bash
prodpage [command] [options]
```

## Documentation

For detailed documentation on global options, commands, and configuration, please see the [DOCUMENTATION.md](DOCUMENTATION.md) file.

### Build Command Examples

```bash
# Build using the configuration file
prodpage build

# Build using a specific pattern
prodpage build "**/__products__/*.json"

# Build and generate a menu for featured products
prodpage build --featured-menu
```

### Init Command Examples

```bash
# Create a default configuration file
prodpage init

# Create a configuration file with a custom name
prodpage init my-config.json

# Create a configuration file with default values
prodpage init -y
```

## Contributing

Contributions are welcome! Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
