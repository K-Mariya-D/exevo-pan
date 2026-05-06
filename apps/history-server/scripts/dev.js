#!/usr/bin/env node

const { spawnSync } = require('node:child_process')

const env = {
  ...process.env,
  PORT: '4000',
  NODE_OPTIONS: '--max_old_space_size=10000',
}

const result = spawnSync('sucrase-node', ['src'], {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32',
})

if (result.error) {
  console.error(result.error)
  process.exit(1)
}

process.exit(result.status ?? 1)
