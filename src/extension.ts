import { Span } from '@opentelemetry/api';
import { existsSync } from 'fs';
import { join } from 'path';
import { commands, ExtensionContext, extensions, RelativePattern, tasks, TextDocument, window, workspace } from 'vscode';
import { getBazelProjectFile } from './bazelProjectParser';
import { BazelServerTerminal, getBazelTerminal } from './bazelServerTerminal';
import { BazelTaskManager } from './bazelTaskManager';
import { registerBuildifierFormatter } from './buildifier';
import { Commands } from './commands';
import { BazelExtensionPlugin, BazelVscodeExtensionAPI } from './extension.api';
import { ProjectViewManager } from './projectViewManager';
import { BazelRunTargetProvider } from './provider/bazelRunTargetProvider';
import { BazelTaskProvider } from './provider/bazelTaskProvider';
import { ExtensionOtel, registerMetrics } from './tracing/extensionOtel';
import { getWorkspaceRoot, initBazelProjectFile, isBazelWorkspaceRoot, outputLog } from './util';

const workspaceRoot = getWorkspaceRoot();

export async function activate(context: ExtensionContext): Promise<BazelVscodeExtensionAPI> {
	// activates
	// LS processes current .eclipse/.bazelproject file
	// if it DNE create one
	// register TCP port with LS
	// project view should reflect what's in the LS
	// show any directories listed in the .bazelproject file
	// fetch all projects loaded into LS and display those as well
	// show .eclipse folder

	registerMetrics(context);

	window.registerTreeDataProvider(
		'bazel.taskOutline',
		BazelRunTargetProvider.instance
	);
	tasks.registerTaskProvider('bazel', new BazelTaskProvider());

	outputLog.trace('extension activated');

	workspace.onDidSaveTextDocument((doc) => {
		if (doc.fileName.includes('bazelproject')) {
			toggleBazelProjectSyncStatus(doc);
		}
	});

	commands.executeCommand(
		'setContext',
		'isBazelWorkspaceRoot',
		isBazelWorkspaceRoot()
	);
	commands.executeCommand(
		'setContext',
		'isMultiRoot',
		workspace.workspaceFile?.fsPath.includes('code-workspace')
	);

	context.subscriptions.push(
		commands.registerCommand(
			Commands.OPEN_BAZEL_BUILD_STATUS_CMD,
			getBazelTerminal().show
		)
	);

	// create .eclipse/.bazelproject file if DNE
	if (isBazelWorkspaceRoot()) {
		initBazelProjectFile();
		const showBazelprojectConfig =
			workspace.getConfiguration('bazel.projectview');
		if (showBazelprojectConfig.get('open')) {
			openBazelProjectFile();
			showBazelprojectConfig.update('open', false); // only open this file on the first activation of this extension
		}
		ProjectViewManager.updateProjectView();

		context.subscriptions.push(
			commands.registerCommand(Commands.OPEN_BAZEL_PROJECT_FILE, () =>
				openBazelProjectFile()
			)
		);
	}

	context.subscriptions.push(
		commands.registerCommand(
			Commands.SYNC_PROJECTS,
			syncProjectView
		)
	);

	context.subscriptions.push(
		commands.registerCommand(
			Commands.BAZEL_TARGET_REFRESH,
			BazelTaskManager.refreshTasks
		)
	);

	context.subscriptions.push(
		commands.registerCommand(
			Commands.BAZEL_TARGET_RUN,
			BazelTaskManager.runTask
		)
	);

	context.subscriptions.push(
		commands.registerCommand(
			Commands.BAZEL_TARGET_KILL,
			BazelTaskManager.killTask
		)
	);

	context.subscriptions.push(
		commands.registerCommand(
			Commands.CONVERT_PROJECT_WORKSPACE,
			ProjectViewManager.covertToMultiRoot
		)
	);

	registerBuildifierFormatter();

	// if this is a multi-root project, create a listener to refresh the symlinked project root directory on file add/remove
	if (ProjectViewManager.isMultiRoot()) {
		const w = workspace.createFileSystemWatcher(
			new RelativePattern(workspaceRoot, '*')
		);
		w.onDidCreate((_e) => ProjectViewManager.syncWorkspaceRoot());
		w.onDidDelete((_e) => ProjectViewManager.syncWorkspaceRoot());
	}

	// trigger a refresh of the tree view when any task get executed
	tasks.onDidStartTask((_) => BazelRunTargetProvider.instance.refresh());
	tasks.onDidEndTask((_) => BazelRunTargetProvider.instance.refresh());

	ExtensionOtel.getInstance(context).tracer.startActiveSpan(
		'extension.activation',
		(span: Span) => {
			span.addEvent('activation success');
			span.end();
		}
	);

	return Promise.resolve({
		parseProjectFile: await getBazelProjectFile(),
		bazelTerminal: BazelServerTerminal.instance
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}


function toggleBazelProjectSyncStatus(doc: TextDocument) {
	if (workspace.getConfiguration('bazel.projectview').get('notification')) {
		window
			.showWarningMessage(
				`The Bazel Project View changed. Do you want to synchronize?`,
				...['Sync', 'Do Nothing']
			)
			.then((val) => {
				if (val === 'Sync') {
					syncProjectView();
				} else if (val === 'Do Nothing') {
					workspace
						.getConfiguration('bazel.projectview')
						.update('notification', false);
				}
			});
	}
}

function openBazelProjectFile() {
	try {
		const projectViewPath = join(workspaceRoot, '.eclipse', '.bazelproject');
		if (existsSync(projectViewPath)) {
			workspace
				.openTextDocument(projectViewPath)
				.then((f) => window.showTextDocument(f));
		} else {
			window.showErrorMessage(`${projectViewPath} does not exist`);
		}
	} catch (err) {
		window.showErrorMessage(
			'Unable to open the bazel project file; invalid workspace'
		);
	}
}

function syncProjectView(){
	outputLog.info('syncing project');
	ProjectViewManager.updateProjectView();

	// if bazel-vscode-java extension exists, execute it's sync method
	const bazelJavaExtension = extensions.getExtension<BazelExtensionPlugin>('sfdc.bazel-vscode-java')
	if( bazelJavaExtension ){
		outputLog.info('syncing java project')
		bazelJavaExtension.exports.sync()
	}

}
