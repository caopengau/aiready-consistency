#!/usr/bin/env node

import { Command } from 'commander';
import { defineContextCommand } from './cli-definition';

const program = new Command();
defineContextCommand(program);
program.parse(process.argv);
