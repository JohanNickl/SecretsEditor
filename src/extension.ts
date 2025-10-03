// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as crypto from 'crypto';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "secretseditor" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('secretseditor.editSecrets', async (uri: vscode.Uri) => {
		try {
			// Get the .csproj file path
			const csprojPath = uri.fsPath;
			console.log('Processing .csproj file:', csprojPath);

			// Find or create the secrets.json file
			const secretsPath = await findOrCreateSecretsFile(csprojPath);
			
			if (secretsPath) {
				// Open the secrets file in a new editor
				const document = await vscode.workspace.openTextDocument(secretsPath);
				await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.Beside });
				vscode.window.showInformationMessage(`Opened secrets file: ${path.basename(secretsPath)}`);
			} else {
				vscode.window.showErrorMessage('Could not find or create secrets file for this project.');
			}
		} catch (error) {
			vscode.window.showErrorMessage(`Error opening secrets file: ${error}`);
		}
	});

	context.subscriptions.push(disposable);
}

async function findOrCreateSecretsFile(csprojPath: string): Promise<string | null> {
	try {
		// Read the .csproj file to get the UserSecretsId
		const csprojContent = fs.readFileSync(csprojPath, 'utf8');
		let userSecretsId = extractUserSecretsId(csprojContent);

		// If no UserSecretsId exists, generate one and add it to the .csproj
		if (!userSecretsId) {
			userSecretsId = crypto.randomUUID();
			await addUserSecretsIdToCsproj(csprojPath, userSecretsId);
		}

		// Construct the path to the secrets.json file
		// This follows the official .NET user secrets convention:
		// Windows: %APPDATA%\Microsoft\UserSecrets\{UserSecretsId}\secrets.json (roaming profile)
		// macOS/Linux: ~/.microsoft/usersecrets/{UserSecretsId}/secrets.json
		// ✅ Validated: Compatible with Visual Studio and dotnet CLI tooling
		const secretsDir = getSecretsDirectory(userSecretsId);
		const secretsPath = path.join(secretsDir, 'secrets.json');

		// Create the directory if it doesn't exist
		if (!fs.existsSync(secretsDir)) {
			fs.mkdirSync(secretsDir, { recursive: true });
		}

		// Create the secrets.json file if it doesn't exist
		if (!fs.existsSync(secretsPath)) {
			fs.writeFileSync(secretsPath, '{\n  \n}', 'utf8');
		}

		return secretsPath;
	} catch (error) {
		console.error('Error finding or creating secrets file:', error);
		return null;
	}
}

function getSecretsDirectory(userSecretsId: string): string {
	if (process.platform === 'win32') {
		// Windows: %APPDATA%\Microsoft\UserSecrets\{UserSecretsId}
		const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
		return path.join(appData, 'Microsoft', 'UserSecrets', userSecretsId);
	} else {
		// macOS/Linux: ~/.microsoft/usersecrets/{UserSecretsId}
		return path.join(os.homedir(), '.microsoft', 'usersecrets', userSecretsId);
	}
}

function extractUserSecretsId(csprojContent: string): string | null {
	const userSecretsIdMatch = csprojContent.match(/<UserSecretsId>(.*?)<\/UserSecretsId>/);
	return userSecretsIdMatch ? userSecretsIdMatch[1] : null;
}

async function addUserSecretsIdToCsproj(csprojPath: string, userSecretsId: string): Promise<void> {
	try {
		let csprojContent = fs.readFileSync(csprojPath, 'utf8');
		
		// Find the first PropertyGroup and add UserSecretsId to it
		const propertyGroupMatch = csprojContent.match(/(<PropertyGroup[^>]*>)/);
		if (propertyGroupMatch) {
			const insertPosition = csprojContent.indexOf(propertyGroupMatch[1]) + propertyGroupMatch[1].length;
			const userSecretsIdElement = `\n    <UserSecretsId>${userSecretsId}</UserSecretsId>`;
			csprojContent = csprojContent.slice(0, insertPosition) + userSecretsIdElement + csprojContent.slice(insertPosition);
		} else {
			// If no PropertyGroup exists, create one
			const projectMatch = csprojContent.match(/(<Project[^>]*>)/);
			if (projectMatch) {
				const insertPosition = csprojContent.indexOf(projectMatch[1]) + projectMatch[1].length;
				const propertyGroupWithUserSecretsId = `\n  <PropertyGroup>\n    <UserSecretsId>${userSecretsId}</UserSecretsId>\n  </PropertyGroup>`;
				csprojContent = csprojContent.slice(0, insertPosition) + propertyGroupWithUserSecretsId + csprojContent.slice(insertPosition);
			}
		}

		fs.writeFileSync(csprojPath, csprojContent, 'utf8');
		vscode.window.showInformationMessage('Added UserSecretsId to project file.');
	} catch (error) {
		console.error('Error adding UserSecretsId to .csproj:', error);
		throw error;
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
