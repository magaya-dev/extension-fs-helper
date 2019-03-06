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
