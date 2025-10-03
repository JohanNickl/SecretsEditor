# Change Log

All notable changes to the SecretsEditor extension will be documented in this file.

## [0.0.1] - 2025-10-03

### Added
- Context menu integration for .csproj files with "Edit Secrets" option
- Automatic UserSecretsId generation and injection into project files
- Seamless secrets.json file creation and management
- Cross-platform support following .NET user secrets conventions
- Side-by-side editor opening for secrets files

### Features
- Right-click context menu on .csproj files
- Automatic directory structure creation for user secrets
- Smart detection of existing UserSecretsId in project files

### Validation
- ✅ **Path Validation**: Confirmed compatibility with Visual Studio's user secrets implementation
- ✅ **File Location**: Secrets correctly stored in roaming AppData directory on Windows
- ✅ **Cross-platform**: Tested path construction for Windows, macOS, and Linux
- ✅ **Integration**: Full compatibility with `dotnet user-secrets` CLI and Visual Studio tooling