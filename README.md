# Extensions Filesystem Helper
Helper package to manage local data for Magaya Extensions

This package is designed to create a folder for extension persistent data (config files and extensions related files) outside of extension folder once installed in Magaya. This way the extension can be updated without accidentally deleting important persintent data or configuration files. The folder is located along with Magaya Corp were Magaya software is installed. The structure is "extensions-data/magaya-extension-name/networkId". 

For this package to work an extension.config.json file must be present with valid id property, also Magaya networkId should be sent as a parameter to the function that creates or retrives the extension data folder.

**usage:**

```javascript

const util = require('@magaya/extension-fs-helper');

myExtensionDataFolder = util.GetExtensionDataFolder(extJson.id, networkId);

```

**Important:** 

:point_right: Add extension.config.json file to gitignore so it won't be downloaded to your Magaya installation duplicated. If you want to have extension.config.json file on the repository, please rename it. Also add extension-data folder to gitignore in order to avoid adding your test data and config files to the repository.

### GetExtensionFolder\[Async\](extensionId)

Gets extension installation folder. If the extension folder is not found somewhere up the filesystem tree, then the current working directory is returned.

* `extensionId` `<Object>`: Object with extension id data (company, name)

**Example:**

```javascript
const util = require('@magaya/extension-fs-helper');

myExtensionFolder = util.GetExtensionFolder(extJson.id);
// or async
myExtensionFolder = await util.GetExtensionFolderAsync(extJson.id);
```

### GetExtensionConfig\[Async\](extensionId)

Gets the content from the extension configuration file. Returns null if file is not found somewhere up the filesystem tree.

* `extensionId` `<Object>`: Object with extension id data (company, name)

**Example:**

```javascript
const util = require('@magaya/extension-fs-helper');

myExtConfig = util.GetExtensionConfig(extJson.id);
// or async
myExtConfig = await util.GetExtensionConfigAsync(extJson.id);
```

### GetExtensionDataFolder\[Async\](extensionId, networkID, skipCreate)

Gets extension data folder. If it does not extist, it is created by default. If called from a Magaya installed extension, the path will be:
 
`[magaya-installation-folder]/Magaya Corp/extensions-data/[extension-name]/[network-id]`

Otherwise, the folder will be created relative the current working directory:
 
`[cwd]/extensions-data/[extension-name]/[network-id]`

* `extensionId` `<Object>`: Object with extension id data (company, name)
* `networkID` `<number|string>` Network id running the extension
* `[skipCreate=false]` `<boolean>` If true, the path is resolved but the directory won't be created. Default is `false`

**Example:**

```javascript
const util = require('@magaya/extension-fs-helper');

myExtensionDataFolder = util.GetExtensionDataFolder(extJson.id, networkId, true);
// or async
myExtensionDataFolder = await util.GetExtensionDataFolderAsync(extJson.id, networkId);
```