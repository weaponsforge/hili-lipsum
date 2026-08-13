#!/usr/bin/env node

const { Command } = require('commander')

const hipsumCommand = require('./commands/hipsum')
const scrapeCommand = require('./commands/scrape')
const packageJson = require('../../package.json')
const { CLI_META } = require('./meta')

const program = new Command()

program
  .name(CLI_META.PROGRAM.NAME)
  .description(CLI_META.PROGRAM.DESCRIPTION)
  .version(packageJson?.version ?? '0.0.0')

program.addCommand(hipsumCommand)
program.addCommand(scrapeCommand)

program.parse()
