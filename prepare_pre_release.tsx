#!/usr/bin/env -S npx tsx

import { readFileSync, writeFileSync } from 'fs';

console.log('argv:', process.argv.slice(2))

// read the package.json once so we can use it in the gulp script
const packageJson = JSON.parse(readFileSync('./package.json').toString());

function prepare_pre_release() {
	// parse existing version (using ECMA script regex from https://semver.org/)
	const stableVersion = packageJson.version.match(
		/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
	);
	const major = stableVersion[1];
	// unfortunately, VS Code Marketplace does not support full semver
	// also, the limit is < 2147483647 on VS Code Marketplace
	// thus, we use year (just the last two digits) as minor
	// and patch that is based starting with the month up to the minute (for granularity)
	const date = new Date();
	const year = date.getUTCFullYear() - 2000;
	const month = date.getUTCMonth() + 1;
	const day = date.getUTCDate();
	const hours = date.getUTCHours();
	const minutes = date.getUTCMinutes();
	const patch = `1${prependZero(month)}${prependZero(day)}${prependZero(
		hours
	)}${prependZero(minutes)}`;
	const insiderPackageJson = Object.assign(packageJson, {
		version: `${major}.${year}.${patch}`,
	});
	console.log(`Applying pre-release version '${major}.${year}.${patch}'...`);
	writeFileSync(
		'./package.json',
		JSON.stringify(insiderPackageJson, null, '\t')
	);
}

function prependZero(num) {
	if (num > 99) {
		throw new Error('Unexpected value to prepend with zero');
	}
	return `${num < 10 ? '0' : ''}${num}`;
}

prepare_pre_release()