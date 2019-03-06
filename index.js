const fs = require('fs');
const path = require('path');

function isExtensionConfig(result, extensionId) {
    if (!fs.existsSync(result))
        return false;

    const extensionConfig = require(result);
    if (!extensionConfig || !extensionConfig.id)
        return false;

    return (extensionConfig.id.name === extensionId.name && extensionConfig.id.company === extensionId.company);
}

function GetExtensionFolder(currentFolder, extensionId) {
    let result =  currentFolder;
    while (!isExtensionConfig(result + '\\extension.config.json', extensionId)) {
        let upFolder = path.join(result, '..');
        if (upFolder != result) {
            result = upFolder;
        }
        else
            break;
    }
    return result;
}

function CreatePath(currentFolder, targetPath) { 
    const sep = /[\/|\\]/g;
    return targetPath.split(sep).reduce((parentDir, childDir) => {
            curDir = path.join(parentDir, childDir);
            if (!fs.existsSync(curDir)) {
                fs.mkdirSync(curDir);
            }
            return curDir;
        }
        , currentFolder
    );
}

function GetExtensionDataFolder(extensionId, networkID){
    //if installed in Magaya, get or create a Folder in ../Magaya Corp/"extensions-data"/extensionDataFolder/networkId
    //otherwise ../extensionFolder/"extensions-data"/extensionDataFolder/networkId
    let nodeFolder = process.cwd();

    if (!extensionId || !extensionId.name || !extensionId.company) 
        throw new Error('Please specify the extension that will be installed in Magaya.');
    if (!networkID)   
        throw new Error('Please specify Communication Suite NetworkId that this extension belongs to.');

    let currentFolder = GetExtensionFolder(nodeFolder, extensionId);
    if (!isExtensionConfig(path.join(currentFolder,'\\extension.config.json')))
        currentFolder = nodeFolder;
    let upFolder = path.join(currentFolder, '..');
    upFolderName = path.basename(upFolder);
    if (upFolderName === 'extensions') {
        currentFolder = path.join(upFolder, '..\\..');
    }
    //Add always NetworkID after Extension Data folder in case more than one CS is running on the same PC
    let myExtensionDataPath = 'extensions-data/' + extensionId.company + '-' + extensionId.name + '/' + networkID;
    let result = path.join(currentFolder, myExtensionDataPath);
    if (!fs.existsSync(result)) {
        result = CreatePath(currentFolder, myExtensionDataPath);
    }
    return result;
}

module.exports = {
    GetExtensionDataFolder : GetExtensionDataFolder
};

