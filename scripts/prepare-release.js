#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

function runCommand(command, description) {
  try {
    console.log(`⏳ ${description}...`);
    const result = execSync(command, { 
      cwd: projectRoot, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log(`✅ ${description} completed`);
    return result.trim();
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

function getCurrentVersion() {
  try {
    const packagePath = join(projectRoot, 'package.json');
    const packageContent = readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    return packageJson.version;
  } catch (error) {
    console.error('❌ Failed to read version from package.json:', error.message);
    process.exit(1);
  }
}

function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { 
      cwd: projectRoot, 
      encoding: 'utf8' 
    }).trim();
  } catch (error) {
    console.error('❌ Failed to get current branch:', error.message);
    process.exit(1);
  }
}

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { 
      cwd: projectRoot, 
      encoding: 'utf8' 
    }).trim();
    
    if (status) {
      console.log('⚠️  Working directory has uncommitted changes:');
      console.log(status);
      console.log('\n❌ Please commit or stash changes before creating a release');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Failed to check git status:', error.message);
    process.exit(1);
  }
}

// Main execution
try {
  const version = getCurrentVersion();
  const currentBranch = getCurrentBranch();
  
  console.log(`🚀 Preparing release v${version} from branch: ${currentBranch}\n`);
  
  // Pre-flight checks
  checkGitStatus();
  console.log('✅ Working directory is clean');
  
  // Run comprehensive checks
  runCommand('npm run clean', 'Cleaning build artifacts');
  runCommand('npm install', 'Installing fresh dependencies');
  runCommand('npm run build', 'Building all packages');
  runCommand('npm run test', 'Running test suite');
  runCommand('npm run lint', 'Running linting checks');
  runCommand('npm run check', 'Running type checks');
  runCommand('npm audit --audit-level=high', 'Running security audit');
  
  console.log(`\n🎉 Release v${version} is ready!`);
  console.log(`\n📋 Release preparation completed:`);
  console.log(`   ✅ All dependencies updated`);
  console.log(`   ✅ All packages built successfully`);
  console.log(`   ✅ All tests passing`);
  console.log(`   ✅ Code quality checks passed`);
  console.log(`   ✅ Security audit passed`);
  
  console.log(`\n🚀 Next steps for release:`);
  console.log(`   1. Create release branch: git checkout -b release/v${version}`);
  console.log(`   2. Push to remote: git push origin release/v${version}`);
  console.log(`   3. Create PR to main branch`);
  console.log(`   4. After merge, create tag: git tag v${version} && git push origin v${version}`);
  console.log(`   5. Use semantic-release: npm run semantic-release`);
  
} catch (error) {
  console.error('\n❌ Release preparation failed:', error.message);
  console.log('\n🔧 Please fix the issues above and try again');
  process.exit(1);
}