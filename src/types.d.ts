export interface ExcludeConfig {
	[x: string]: boolean;
}

export interface FileWatcherExcludeConfig {
	[x: string]: boolean;
}

export interface ParseConfig {
	root: string;
	imports: string[];
	projectView: BazelProjectView;
	processedImports: string[];
}

export interface BazelProjectView {
	directories: string[];
	targets: string[];
	deriveTargetsFromDirectories: boolean;
	workspaceType?: string;
	additionalLanguages?: string[];
	javaLanguageLevel?: string;
	tsConfigRules?: string[];
	importRunConfigurations?: string[];
	bazelBinary?: string;
	projectMappings?: string[];
	targetDiscoveryStrategy?: string;
	targetProvisioningStrategy?: string;
}

export interface RawSection {
	name: string;
	body: string;
}
