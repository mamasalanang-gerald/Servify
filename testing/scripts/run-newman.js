const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const skipBootstrap = args.includes('--skip-bootstrap');

const getArgValue = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  return args[index + 1] || null;
};

if (!skipBootstrap) {
  const bootstrapPath = path.join(__dirname, 'bootstrap-test-users.js');
  const bootstrapResult = spawnSync(process.execPath, [bootstrapPath], {
    cwd: root,
    stdio: 'inherit'
  });

  if (bootstrapResult.error) {
    console.error(`Failed to bootstrap test data: ${bootstrapResult.error.message}`);
    process.exit(1);
  }

  if (bootstrapResult.status !== 0) {
    process.exit(bootstrapResult.status ?? 1);
  }
}

const folder = getArgValue('--folder');
const collectionPath = getArgValue('--collection') || path.join(root, 'postman', 'Servify.API.postman_collection.json');
const environmentPath = getArgValue('--env') || path.join(root, 'postman', 'local.postman_environment.json');

if (!fs.existsSync(collectionPath)) {
  console.error(`Collection not found: ${collectionPath}`);
  process.exit(1);
}

if (!fs.existsSync(environmentPath)) {
  console.error(`Environment not found: ${environmentPath}`);
  process.exit(1);
}

const reportsDir = path.join(root, 'reports');
fs.mkdirSync(reportsDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[.:]/g, '-');
const runLabel = folder ? folder.toLowerCase().replace(/\s+/g, '-') : 'all';

const junitPath = path.join(reportsDir, `${runLabel}-${timestamp}.xml`);
const htmlPath = path.join(reportsDir, `${runLabel}-${timestamp}.html`);

const newmanArgs = [
  'newman',
  'run',
  collectionPath,
  '-e',
  environmentPath,
  '--reporters',
  'cli,junit,htmlextra',
  '--reporter-junit-export',
  junitPath,
  '--reporter-htmlextra-export',
  htmlPath
];

if (folder) {
  newmanArgs.push('--folder', folder);
}

console.log('Running Newman with:');
console.log(`- Collection: ${collectionPath}`);
console.log(`- Environment: ${environmentPath}`);
console.log(`- Folder: ${folder || '(all folders)'}`);

const result = spawnSync('npx', newmanArgs, {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

console.log('\nReports generated:');
console.log(`- ${htmlPath}`);
console.log(`- ${junitPath}`);

process.exit(result.status ?? 1);
