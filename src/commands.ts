'use strict';


/**
 * Commonly used commands
 */
export namespace Commands {

	/**
	 * Synchronize all projects of a Bazel workspace
	 */
	export const SYNC_PROJECTS = 'bazel.sync';

	export const OPEN_BAZEL_BUILD_STATUS_CMD = 'bazel.showStatus';

	export const BAZEL_TARGET_REFRESH = 'bazel.taskOutline.refresh';
	export const BAZEL_TARGET_RUN = 'bazel.taskOutline.run';
	export const BAZEL_TARGET_KILL = 'bazel.taskOutline.kill';

	export const OPEN_BAZEL_PROJECT_FILE = 'bazel.projectview.open';

	export const CONVERT_PROJECT_WORKSPACE = 'bazel.convert.workspace';
}
