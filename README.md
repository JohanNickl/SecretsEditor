# SecretsEditor

A Visual Studio Code extension that provides seamless access to .NET user secrets for C# projects directly from the explorer context menu.

## ✨ Features

- **🎯 Context Menu Integration**: Right-click on any `.csproj` file to access "Edit Secrets"
- **🔧 Automatic Setup**: Finds existing secrets or creates new ones automatically
- **🆔 Smart ID Management**: Generates and adds `UserSecretsId` to your project if missing
- **📂 Side-by-Side Editing**: Opens secrets.json in a new editor tab for easy editing

## 🚀 Quick Start

1. Open a workspace with .NET projects
2. Right-click any `.csproj` file in the Explorer
3. Select **"Edit Secrets"** from the context menu
4. Edit your secrets in the opened `secrets.json` file

## 🔄 How It Works

When you use "Edit Secrets", the extension:

1. **Scans** your `.csproj` file for existing `UserSecretsId`
2. **Generates** a new GUID and adds it to your project if needed
3. **Creates** the secrets directory structure following .NET conventions
4. **Opens** the `secrets.json` file for immediate editing

## 📋 Requirements

- Visual Studio Code 1.104.0+
- .NET projects with `.csproj` files

## 📁 File Locations

Secrets are stored following .NET conventions:

- **Windows**: `%APPDATA%\Microsoft\UserSecrets\{UserSecretsId}\secrets.json`
- **macOS/Linux**: `~/.microsoft/usersecrets/{UserSecretsId}/secrets.json`

## ⚠️ Known Limitations

- Currently supports `.csproj` files only (C# projects)
- Requires valid .NET project structure

## 📝 Configuration

No configuration needed! The extension works out of the box with zero setup.

## 🔄 Release Notes

### 0.0.1

**Initial Release**
- Context menu integration for .csproj files
- Automatic UserSecretsId generation and management
- Seamless secrets.json file creation and editing

---

## 📚 Resources

- [.NET User Secrets Documentation](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets)
- [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

**Happy coding! 🎉**
