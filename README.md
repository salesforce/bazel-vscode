# Bazel Extension for VS Code

[![Build](https://github.com/salesforce/bazel-vscode/actions/workflows/ci.yml/badge.svg)](https://github.com/salesforce/bazel-vscode/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)


A comprehensive VS Code extension that provides full support for Bazel build system integration, including Java language support, project management, and development tools.

## 🚀 Features

### 🔧 Core Bazel Integration
- **Automatic Workspace Detection**: Automatically detects Bazel workspaces by looking for `WORKSPACE` or `WORKSPACE.bazel` files
- **Project View Management**: Creates and manages `.bazelproject` files for optimal project structure
- **Multi-Root Workspace Support**: Convert single-root workspaces to multi-root for better organization
- **File Watcher Optimization**: Automatically configures file watchers to only monitor relevant directories

### 📝 Language Support
- **Starlark Syntax Highlighting**: Full syntax highlighting for Bazel build files (`.BUILD`, `.WORKSPACE`, `.bzl`, `.bazel`, `.bzlmod`, `.sky`, `.star`)
- **Bazel Project File Support**: Syntax highlighting for `.bazelproject` files
- **Language Configuration**: Proper indentation, bracket matching, and comment support for Starlark files

### 🛠️ Build Tools Integration
- **Buildifier Integration**: Automatic code formatting for Starlark files using the `buildifier` tool
- **Format on Save**: Automatically format Bazel files when saving (configurable)
- **Custom Buildifier Path**: Support for custom buildifier binary locations

### 🎯 Task Management
- **Bazel Run Targets View**: Visual tree view of all available Bazel run targets in the Explorer
- **Task Execution**: Run Bazel targets directly from the VS Code interface
- **Task Monitoring**: Real-time status tracking of running Bazel tasks
- **Task Control**: Start, stop, and refresh Bazel tasks with intuitive controls

### 🔄 Project Synchronization
- **Project View Sync**: Synchronize project structure based on `.bazelproject` file changes
- **Automatic Sync Notifications**: Get notified when project view changes and choose to sync
- **Java Project Integration**: Seamless integration with the Bazel Java Language Server
- **Dependency Resolution**: Automatic classpath and dependency resolution using Bazel BUILD files

### 🎨 User Interface
- **Bazel Run Targets Panel**: Dedicated panel in the Explorer showing all available run targets
- **Context-Aware Commands**: Commands that adapt based on workspace state and file context
- **Status Indicators**: Visual indicators for running tasks and sync status
- **Multi-Root Workspace Conversion**: One-click conversion to multi-root workspace format

### ⚙️ Configuration Options
- **Logging Control**: Configurable log levels (debug, warn, info, error, trace)
- **Project View Settings**: Control automatic opening and notification behavior
- **Buildifier Settings**: Enable/disable formatting and configure binary path
- **Import Control**: Option to disable Bazel importer functionality

## 📦 Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Bazel extension by Salesforce Engineering"
4. Click Install

### From OpenVSX Registry
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "sfdc.bazel-vscode-java"
4. Click Install

### Direct Installation
```bash
# Clone the repository
git clone https://github.com/salesforce/bazel-vscode.git

# Install dependencies
npm install

# Build the extension
npm run build

# Package the extension
npm run package
```

## 🚀 Getting Started

### Prerequisites
- VS Code 1.100.0 or higher
- Bazel build system installed and configured
- Buildifier tool (optional, for code formatting)

### Basic Setup
1. **Open a Bazel Workspace**: Open VS Code in a directory containing a `WORKSPACE` or `WORKSPACE.bazel` file
2. **Automatic Detection**: The extension will automatically detect the Bazel workspace
3. **Project View Creation**: If no `.bazelproject` file exists, one will be created automatically
4. **Initial Sync**: The extension will perform an initial project synchronization

### Project View Configuration
The extension uses `.bazelproject` files to define which directories and targets to include in your VS Code workspace:

```bazelproject
directories:
  src/main/java
  src/test/java
  tools

targets:
  //src/main/java/com/example:app
  //src/test/java/com/example:test
```

## 🎮 Usage

### Commands
Access these commands via the Command Palette (Ctrl+Shift+P):

- **`Bazel: Sync Project View`**: Synchronize the project view with current `.bazelproject` file
- **`Bazel: Refresh Bazel Run Configs`**: Refresh the list of available Bazel run targets
- **`Bazel: Run Bazel Target`**: Execute a selected Bazel target
- **`Bazel: Kill Bazel Target`**: Stop a running Bazel target
- **`Bazel: Open the Bazel Project View file`**: Open the `.bazelproject` file for editing
- **`Bazel: Convert to Multi-Root workspace`**: Convert single-root workspace to multi-root format

### Bazel Run Targets Panel
1. Open the Explorer panel (Ctrl+Shift+E)
2. Look for the "Bazel Run Targets" section
3. Click the refresh button to update the list
4. Click the play button next to any target to run it
5. Click the stop button to kill a running target

## ⚙️ Configuration

### Extension Settings
Configure the extension behavior in VS Code settings:

```json
{
  "bazel.import.disabled": false,
  "bazel.log.level": "info",
  "bazel.projectview.open": true,
  "bazel.projectview.updateFileWatcherExclusion": true,
  "bazel.projectview.notification": true,
  "bazel.buildifier.enable": true,
  "bazel.buildifier.binary": null
}
```

### Settings Description
- **`bazel.import.disabled`**: Disable the Bazel importer functionality
- **`bazel.log.level`**: Set logging level (debug, warn, info, error, trace)
- **`bazel.projectview.open`**: Automatically open the Bazel Project View file on activation
- **`bazel.projectview.updateFileWatcherExclusion`**: Update file watcher exclusions based on `.bazelproject`
- **`bazel.projectview.notification`**: Show sync notifications when `.bazelproject` changes
- **`bazel.buildifier.enable`**: Enable automatic formatting with buildifier
- **`bazel.buildifier.binary`**: Custom path to buildifier binary (null = use PATH)

## 🔧 Troubleshooting

### Common Issues

**Extension not activating:**
- Ensure you're in a Bazel workspace (contains `WORKSPACE` or `WORKSPACE.bazel`)
- Check VS Code version compatibility (requires 1.100.0+)

**Project view not syncing:**
- Verify `.bazelproject` file exists and is properly formatted
- Check extension logs for error messages
- Try manual sync via Command Palette

**Buildifier not working:**
- Ensure buildifier is installed and in your PATH
- Check buildifier binary path in settings
- Verify buildifier permissions

### Logs and Debugging
Enable debug logging to troubleshoot issues:

1. Open VS Code settings
2. Set `bazel.log.level` to `debug`
3. Open the Output panel (View → Output)
4. Select "Bazel" from the dropdown
5. Check for error messages and debug information


## 📚 Related Links

- [Bazel Build System](https://bazel.build/)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Starlark Language](https://github.com/bazelbuild/starlark)
- [Bazel Project Views](https://ij.bazel.build/docs/project-views.html)
- [Bazel VSCode Java Plugin](https://github.com/salesforce/bazel-vscode-java)
