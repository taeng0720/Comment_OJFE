import chalk from 'chalk';
import semver from 'semver';
import { execSync } from 'child_process';
import packageConfig from '../package.json' assert { type: 'json' };
import shell from 'shelljs';

function exec(cmd) {
  return execSync(cmd).toString().trim();
}

const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node
  }
];

if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  });
}

export default function () {
  const warnings = [];
  for (const mod of versionRequirements) {
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(`${mod.name}: ${chalk.red(mod.currentVersion)} should be ${chalk.green(mod.versionRequirement)}`);
    }
  }

  if (warnings.length) {
    console.log('');
    console.log(chalk.yellow('이 템플릿을 사용하려면 다음 모듈을 업데이트해야 합니다:'));
    console.log();
    for (const warning of warnings) {
      console.log(`  ${warning}`);
    }
    console.log();
    process.exit(1);
  }
}
