const path = require('path');
const requirePackageName = require('require-package-name');
const { tryRequire } = require('../utils');

export default function storybookParser(filePath, deps, rootDir) {
  const foundDeps = [];
  const config = tryRequire(filePath, rootDir);
  const { addons, core, framework, typescript } = config;
  if (typeof framework === 'string') {
    foundDeps.push(framework);
  }
  if (Array.isArray(addons)) {
    foundDeps.push(...addons);
  }
  if (core) {
    const { builder } = core;
    if (builder === 'webpack5') {
      foundDeps.push('@storybook/builder-webpack5');
      foundDeps.push('@storybook/manager-webpack5');
    } else if (builder) {
      const builderPackage = requirePackageName(builder);
      if (builderPackage) {
        foundDeps.push(builderPackage);
      }
    }
  }
  if (typescript) {
    foundDeps.push('typescript');
  }
  return foundDeps.filter(
    (p) => !(path.isAbsolute(p) || p.startsWith('./') || p.startsWith('../')),
  );
}
