import { Writable } from 'stream';
import { Terminal, window, workspace } from 'vscode';
import { BazelTerminal } from './bazelTerminal';

const BAZEL_TERMINAL_NAME = 'Bazel Build Status';

export class BazelServerTerminal {

	private static _instance: BazelServerTerminal;

	private constructor(){}

	public static get instance(){
		return this._instance || (this._instance = new this());
	}

	stream(): Writable {
		const s = new Writable();
		s._write = (chunk: Buffer, encoding, next) => {
			getBazelTerminal().sendText(chunk.toString());
			next();
		};
		s.on('unpipe', () => s.end());

		return s;
	}

	// good reference if you want to change any colors https://misc.flogisoft.com/bash/tip_colors_and_formatting
	info(msg: string) {
		getBazelTerminal().sendText(`\u001b[32m${msg}\u001b[0m`);
	} // green
	warn(msg: string) {
		if (getLogLevel() >= LogLevel.WARN) {
			getBazelTerminal().sendText(`\u001b[33m${msg}\u001b[0m`);
		}
	} // yellow
	debug(msg: string) {
		if (getLogLevel() >= LogLevel.WARN) {
			getBazelTerminal().sendText(`\u001b[34m${msg}\u001b[0m`);
		}
	} // blue
	error(msg: string) {
		getBazelTerminal().sendText(`\u001b[31m${msg}\u001b[0m`);
	} // red
	trace(msg: string) {
		if (getLogLevel() >= LogLevel.WARN) {
			getBazelTerminal().sendText(`\u001b[37m${msg}\u001b[0m`);
		}
	} // gray
}

export function getBazelTerminal(): Terminal {
	const term = window.terminals.find(
		(term) => term.name === BAZEL_TERMINAL_NAME
	);
	if (!term) {
		return window.createTerminal({
			name: BAZEL_TERMINAL_NAME,
			pty: new BazelTerminal(),
		});
	}
	return term;
}

enum LogLevel {
	INFO,
	ERROR = 0,
	WARN = 1,
	DEBUG = 2,
	TRACE = 3,
}

function getLogLevel(): LogLevel {
	const levelVal = workspace.getConfiguration('bazel').get('log.level');

	switch (levelVal) {
		case 'debug':
			return LogLevel.DEBUG;
		case 'warn':
			return LogLevel.WARN;
		case 'trace':
			return LogLevel.TRACE;
		default:
			return LogLevel.INFO;
	}
}
