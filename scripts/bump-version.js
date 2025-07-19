#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const versionType = process.argv[2] || 'patch'; // patch, minor, major

if (!['patch', 'minor', 'major'].includes(versionType)) {
  console.error('❌ Invalid version type. Use: patch, minor, or major');
  process.exit(1);
}

function bumpVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid version type: ${type}`);
  }
}

function updatePackageJson(filePath, newVersion) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const pkg = JSON.parse(content);
    const oldVersion = pkg.version;
    
    pkg.version = newVersion;
    
    writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`✅ Updated ${filePath}: ${oldVersion} → ${newVersion}`);
    
    return { oldVersion, newVersion };
  } catch (error) {
    console.error(`❌ Failed to update ${filePath}:`, error.message);
    process.exit(1);
  }
}

// Main execution
try {
  console.log(`🚀 Bumping ${versionType} version across monorepo...\n`);
  
  // Read current version from root package.json
  const rootPackagePath = join(projectRoot, 'package.json');
  const rootPackage = JSON.parse(readFileSync(rootPackagePath, 'utf8'));
  const currentVersion = rootPackage.version;
  const newVersion = bumpVersion(currentVersion, versionType);
  
  console.log(`📦 Root version: ${currentVersion} → ${newVersion}\n`);
  
  // Update all package.json files
  const packagePaths = [
    join(projectRoot, 'package.json'),
    join(projectRoot, 'graphql-server', 'package.json'),
    join(projectRoot, 'frontend', 'package.json'),
  ];
  
  for (const packagePath of packagePaths) {
    updatePackageJson(packagePath, newVersion);
  }
  
  console.log(`\n🎉 Successfully bumped all packages to v${newVersion}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Review the changes: git diff`);
  console.log(`   2. Commit the version bump: git add . && git commit -m "chore: bump version to v${newVersion}"`);
  console.log(`   3. Create release: npm run release:branch`);
  
} catch (error) {
  console.error('❌ Version bump failed:', error.message);
  process.exit(1);
}