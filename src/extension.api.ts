import { BazelServerTerminal } from './bazelServerTerminal';
import { BazelProjectView } from './types';

export interface BazelVscodeExtensionAPI {
	readonly parseProjectFile: BazelProjectView;
	readonly bazelTerminal: BazelServerTerminal;
}

export interface BazelExtensionPlugin {
	readonly sync: Function
}