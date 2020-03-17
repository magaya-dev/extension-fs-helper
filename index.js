const fse = require('fs-extra');
const path = require('path');

const EXT_DIRNAME = 'extensions';
const EXT_CONFIG_FILENAME = 'extension.config.json';
const EXT_DATA_DIRNAME = 'extensions-data';

/**
 * @async
 * Gets extension installation folder. If the extension folder is not found
 * somewhere up the filesystem tree, then the current working directory is returned.
 * 
 * @param {Object} extensionId Object with extension id data (company, name)
 * 
 * @returns {Promise<string>} Path to extension folder
 */
async function GetExtensionFolderAsync (extensionId) {
    if (!extensionId || !extensionId.name || !extensionId.company) 
        throw new Error(`Invalid extension id arg: ${extensionId}`);
        
    const cwd = process.cwd();
    let current = cwd;

    while ( !(await _isExtensionConfigAsync(path.join(current, EXT_CONFIG_FILENAME), extensionId)) ) {
        const up = path.join(current, '..');
        if (up !== current) {
            current = up;
        } else {
            console.log(`[extension-fs-helper] Got to file system root without finding extension folder. Falling back to cwd.`);
            return cwd;
        } 
    }

    // found it
    return current;
}

/**
 * Gets extension installation folder. If the extension folder is not found
 * somewhere up the filesystem tree, then the current working directory is returned.
 * 
 * @param {Object} extensionId Object with extension id data (company, name)
 * 
 * @returns {string} Path to extension folder
 */
function GetExtensionFolder (extensionId) {
    if (!extensionId || !extensionId.name || !extensionId.company) 
        throw new Error(`Invalid extension id arg: ${extensionId}`);

    const cwd = process.cwd();
    let current = cwd;

    while (!_isExtensionConfig(path.join(current, EXT_CONFIG_FILENAME), extensionId)) {
        const up = path.join(current, '..');
        if (up !== current) {
            current = up;
        } else {
            console.log(`[extension-fs-helper] Got to file system root without finding extension folder. Falling back to cwd.`);
            return cwd;
        } 
    }

    // found it
    return current;
}

/**
 * @async
 * Gets the content from the extension configuration file.
 * Returns null if file is not found somewhere up the filesystem tree.
 * 
 * @param {Object} extensionId Object with extension id data (company, name)
 * 
 * @returns {Promise<Object>} Extension configuration object.
 */
async function GetExtensionConfigAsync (extensionId) {
    if (!extensionId || !extensionId.name || !extensionId.company) 
        throw new Error(`Invalid extension id arg: ${extensionId}`);

    const folder = await GetExtensionFolderAsync(extensionId);
    const file = path.join(folder, EXT_CONFIG_FILENAME);

    if (await fse.pathExists(file)) {
        const config = await fse.readJson(file);
        // !NOTE(jose): the call to GetExtensionFolder already ensures
        // that config.id == extensionId (no need to check here)
        return config;        
    }

    console.log(`[extension-fs-helper] Missing ${EXT_CONFIG_FILENAME} for ${extensionId.company}-${extensionId.name}`);
    return null;
}

/**
 * Gets the content from the extension configuration file.
 * Returns null if file is not found somewhere up the filesystem tree.
 * 
 * @param {Object} extensionId Object with extension id data (company, name)
 * 
 * @returns {Object} Extension configuration object.
 */
function GetExtensionConfig (extensionId) {
    if (!extensionId || !extensionId.name || !extensionId.company) 
        throw new Error(`Invalid extension id arg: ${extensionId}`);

    const folder = GetExtensionFolder(extensionId);
    const file = path.join(folder, EXT_CONFIG_FILENAME);

    if (fse.pathExistsSync(file)) {
        const config = fse.readJsonSync(file);
        // !NOTE(jose): the call to GetExtensionFolder already ensures
        // that config.id == extensionId (no need to check here)
        return config;        
    }

    console.log(`[extension-fs-helper] Missing ${EXT_CONFIG_FILENAME} for ${extensionId.company}-${extensionId.name}`);
    return null;
}

/**
 * @async
 * Gets extension data folder. If it does not extist, it is created by default.
 * If called from a Magaya installed extension, the path will be:
 * 
 *      [magaya-installation-folder]/Magaya Corp/extensions-data/[extension-name]/[network-id]
 * 
 * Otherwise, the folder will be created relative the current working directory: 
 * 
 *      [cwd]/extensions-data/[extension-name]/[network-id]
 * 
 * @param {Object} extensionId Object with extension id data (company, name)
 * @param {number|string} networkID Network id running the extension
 * @param {boolean} [skipCreate=false] If true, the path is resolved but the directory won't be created
 * 
 * @returns {Promise<string>} Path to extension data folder
 */
async function GetExtensionDataFolderAsync (extensionId, networkID, skipCreate) {
    if (!extensionId || !extensionId.name || !extensionId.company) 
        throw new Error('Please specify the extension that will be installed in Magaya.');
    if (!networkID)   
        throw new Error('Please specify Communication Suite NetworkId that this extension belongs to.');

    // check if we're running from inside magaya extensions installation folder
    let current = await GetExtensionFolder(extensionId);
    const up = path.join(current, '..');
    if (path.basename(up) === EXT_DIRNAME) {
        current = path.join(up, '..\\..');
    }

    const dataPath = path.join(
        current,
        EXT_DATA_DIRNAME,
        `${extensionId.company}-${extensionId.name}`,
        networkID.toString()
    );

    if (!skipCreate) {
        await fse.ensureDir(dataPath);
    }

    return dataPath;
}

/**
 * Gets extension data folder. If it does not extist, it is created by default.
 * If called from a Magaya installed extension, the path will be:
 * 
 *      [magaya-installation-folder]/Magaya Corp/extensions-data/[extension-name]/[network-id]
 * 
 * Otherwise, the folder will be created relative the current working directory: 
 * 
 *      [cwd]/extensions-data/[extension-name]/[network-id]
 * 
 * @param {Object} extensionId Object with extension id data (company, name)
 * @param {number|string} networkID Network id running the extension
 * @param {boolean} [skipCreate=false] If true, the path is resolved but the directory won't be created
 * 
 * @returns {string} Path to extension data folder
 */
function GetExtensionDataFolder (extensionId, networkID, skipCreate) {
    if (!extensionId || !extensionId.name || !extensionId.company) 
        throw new Error('Please specify the extension that will be installed in Magaya.');
    if (!networkID)   
        throw new Error('Please specify Communication Suite NetworkId that this extension belongs to.');

    // check if we're running from inside magaya extensions installation folder
    let current = GetExtensionFolder(extensionId);
    const up = path.join(current, '..');
    if (path.basename(up) === EXT_DIRNAME) {
        current = path.join(up, '..\\..');
    }

    const dataPath = path.join(
        current,
        EXT_DATA_DIRNAME,
        `${extensionId.company}-${extensionId.name}`,
        networkID.toString()
    );

    if (!skipCreate)
        fse.ensureDirSync(dataPath);

    return dataPath;
}

module.exports = {
    GetExtensionFolderAsync,
    GetExtensionFolder,
    GetExtensionConfigAsync,
    GetExtensionConfig,
    GetExtensionDataFolderAsync,
    GetExtensionDataFolder
};

// helpers

async function _isExtensionConfigAsync (path, extensionId) {
    if ( !(await fse.pathExists(path)) )
        return false;

    const config = await fse.readJson(path);
    if (!config || !config.id)
        return false;

    return (config.id.name === extensionId.name && config.id.company === extensionId.company);
}

function _isExtensionConfig (path, extensionId) {
    if (!fse.pathExistsSync(path))
        return false;

    const config = fse.readJsonSync(path);
    if (!config || !config.id)
        return false;

    return (config.id.name === extensionId.name && config.id.company === extensionId.company);
}