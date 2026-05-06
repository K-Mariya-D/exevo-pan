#!/usr/bin/env node

const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const env = { ...process.env }

if (process.platform === 'win32') {
  const profileRoot = 'C:\\Users\\Public'
  const localAppData = path.join(profileRoot, 'AppData', 'Local')
  const roamingAppData = path.join(profileRoot, 'AppData', 'Roaming')

  env.USERPROFILE = profileRoot
  env.HOME = profileRoot
  env.LOCALAPPDATA = localAppData
  env.APPDATA = roamingAppData

  fs.mkdirSync(path.join(localAppData, 'node', 'corepack'), { recursive: true })

  // Force Corepack cache into an ASCII-only path so Turbo child tasks can resolve Yarn.
  spawnSync('corepack', ['prepare', 'yarn@1.22.22', '--activate'], {
    stdio: 'inherit',
    env,
    cwd: process.cwd(),
    shell: true,
  })
}

const copyFile = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to)
  console.log(`'${from}' -> '${to}'`)
}

try {
  fs.rmSync(path.join('apps', 'exevo-pan', '.env.development.local'), {
    force: true,
  })
  copyFile(
    path.join('packages', 'db', '.env.development'),
    path.join('packages', 'db', '.env'),
  )
  copyFile(
    path.join('apps', 'bazaar-scraper', 'Output', 'CurrentAuctions.json'),
    path.join(
      'apps',
      'current-auctions-worker',
      'src',
      'Data',
      'CurrentAuctions.json',
    ),
  )
  copyFile(
    path.join('apps', 'bazaar-scraper', 'Output', 'ServerData.json'),
    path.join(
      'apps',
      'current-auctions-worker',
      'src',
      'Data',
      'ServerData.json',
    ),
  )
  copyFile(
    path.join('apps', 'bazaar-scraper', 'Output', 'ServerData.json'),
    path.join('apps', 'history-server', 'src', 'Data', 'ServerData.json'),
  )
  copyFile(
    path.join('apps', 'bazaar-scraper', 'Output', 'HistoryAuctions.jsonl'),
    path.join('apps', 'history-server', 'src', 'Data', 'HistoryAuctions.jsonl'),
  )
} catch (error) {
  console.error(error)
  process.exit(1)
}

const turbo = spawnSync('turbo', ['run', 'dev', '--parallel'], {
  stdio: 'inherit',
  env,
  cwd: process.cwd(),
  shell: process.platform === 'win32',
})

if (turbo.error) {
  console.error(turbo.error)
  process.exit(1)
}

process.exit(turbo.status ?? 1)
