# Contribution Guide

## Setup

## Build
This project uses [esbuild](https://esbuild.github.io/) for bundling and standard vscode tooling to generate vsix packages. The relevant targets you should be aware of are:
- `npm run build`
	- compiles everything under the `src` dir. Setups everything required to package the extension.
- `npm run test`
	- compiles everything under the `test` dir and executes any [mocha](https://mochajs.org/) test found
- `npm run lint`
	- runs [eslint](https://eslint.org/) against everything in the `src` folder.
- `npm run analyze`
	- analyzes the project and displays a report. Useful for understanding how the project is structured
- `npm run package`
	- uses [vsce](https://github.com/microsoft/vscode-vsce) to generate a VSIX artifact

* The bulk of the build is handled via the `build.ts` wrapper script. This script encapsulates all of our defaults used in bundling the project. If you need to tweak the way the build works you should start first in the `package.json` -> `scripts` subsection, then the `build.ts` script.

## VSCode Launch configs
We have several different launch config setup for this project. All are used for slightly different uses cases.

- `Launch Bazel VSCode Extension`
	- launch the extension in it's default configuration.
- `Run Bazel Extension Tests`
	- execute all mocha tests

## Best Practices

* Always run `npm run test` before pushing/creating a PR
* Always run `npm run lint` before pushing/creating a PR

## Release
