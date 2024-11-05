const fs = require('fs')
const readlinePromises = require('readline')

const SEARCH_DIR = '.'
const LOG_LEVEL = 'INFO'

async function getFullyQualifiedSubDirs(path) {
    return fs.readdirSync(path)
        .filter(subPath => fs.lstatSync(`${path}/${subPath}`).isDirectory())
        .map(subPath => `${SEARCH_DIR}/${subPath}`)
}

async function getSubFiles(path) {
    return fs.readdirSync(path)
        .filter(async function (subPath) {
            return await fs.lstatSync(`${path}/${subPath}`).isFile()
        })
}

async function interrogateMedia(mediaDir) {
    const files = await getSubFiles(mediaDir)
    let mediaConfig = {
        mediaDirPath: mediaDir,
        metadata: {}
    }

    do {
        log('INFO', '')
        log('INFO', `Interrogating media folder ... \n\n${mediaDir}`)
        for (const fileIdx in files) {
            await log('INFO', `\t |_ (${fileIdx}) ${files[fileIdx]}`)
        }
        mediaConfig.metadata = await solicitMediaMetadata()
    } while (mediaConfig.metadata.isConfirmed != 'y')

    mediaConfig.mediaFilePath = getMediaFilePathByIndex(mediaDir, files, mediaConfig.metadata.mediaFileIdx)
    mediaConfig.mediaFileExtension = getFileExtension(mediaConfig.mediaFilePath)
    mediaConfig.filesToDelete = getMediaFilePathsByIndices(mediaDir, files, mediaConfig.metadata.deleteIdxs)

    return mediaConfig
   
}

function getMediaFilePathsByIndices(mediaDir, files, fileIdxs) {
    let mediaFilePathsToDelete = []
    if (fileIdxs.length > 0) {
        fileIdxs.split(',')
        .forEach(fileIdx => mediaFilePathsToDelete.push(getMediaFilePathByIndex(mediaDir, files, fileIdx)))
    }
    return mediaFilePathsToDelete
}

function getMediaFilePathByIndex(mediaDir, files, fileIdx) {
    return `${mediaDir}/${files[fileIdx]}`;
}

function getFileExtension(filePath) {
    return filePath.substring(filePath.lastIndexOf('.'))
}

async function solicitMediaMetadata() {
    let metadata = {}
    metadata.title = await askQuestion(`\nWhat's the title of this?\n`)
    metadata.releaseYear = await askQuestion(`\nWhat year was this released?\n`)
    metadata.quality = await askQuestion(`\nWhat quality level is this? [ SD | HD | FHD ]\n`)
    metadata.isBlueRay = await askQuestion(`\nIs this a BlueRay rip? [ y | n ]\n`)
    metadata.mediaFileIdx = await askQuestion(`\nWhich file is the movie file?\n`)
    metadata.deleteIdxs = await askQuestion(`\nAre there any files that should be deleted? (e.g. 0,1,2,3)\n`)
    metadata.isConfirmed = await askQuestion(`\nEverything look good so far? [ y | n ]\n ${JSON.stringify(metadata, null, 4)}\n`)
    return metadata
}

async function updateMedia(mediaConfig) {
    let mediaDirNameTemplate = buildMediaDirNameTemplate(mediaConfig)
    let mediaFileNameTemplate = buildMediaFileNameTemplate(mediaConfig)

    if (mediaConfig.mediaRootPath.endsWith('/')) { mediaConfig.mediaRootPath = mediaConfig.mediaRootPath.slice(0, -1)}

    log('DEBUG', `Updating media with config: ${JSON.stringify(mediaConfig, null, 4)}`)
    
    if (await isUpdateConfirmed(mediaConfig, mediaFileNameTemplate, mediaDirNameTemplate)) {
        for (const file of mediaConfig.filesToDelete) {
            fs.unlinkSync(file)
        }
        fs.renameSync(mediaConfig.mediaFilePath, `${mediaConfig.mediaDirPath}/${mediaFileNameTemplate}`)
        fs.renameSync(mediaConfig.mediaDirPath, `${mediaConfig.mediaRootPath}/${mediaDirNameTemplate}`)
    } else {
        log('INFO', '\nSkipping that for now and moving on ... Remember: Ctrl-c to abandon ship.')
    }
}

async function isUpdateConfirmed(mediaConfig, mediaFileNameTemplate, mediaDirNameTemplate) {
    log('INFO', '====================== CHANGE SUMMARY ======================');
    log('INFO', `Renaming media file: `);
    log('INFO', `\t Old: \t${mediaConfig.mediaFilePath}`);
    log('INFO', `\t New: \t${mediaConfig.mediaDirPath}/${mediaFileNameTemplate}`);
    log('INFO', '')
    log('INFO', `Renaming media directory: `);
    log('INFO', `\t Old: \t${mediaConfig.mediaDirPath}`);
    log('INFO', `\t New: \t${mediaConfig.mediaRootPath}/${mediaDirNameTemplate}`);
    log('INFO', '')
    log('INFO', `Deleting files: ${JSON.stringify(mediaConfig.filesToDelete, null, 4)}`);
    log('INFO', '============================================================');

    const isConfirmed = await askQuestion(`\nDoes the above change summary look OK? [ y | n ]\n`);
    return isConfirmed == 'y' ? true : false
}

function buildMediaDirNameTemplate(mediaConfig) {
    let mediaDirNameTemplate = `${mediaConfig.metadata.title} (${mediaConfig.metadata.releaseYear}) (${mediaConfig.metadata.quality})`
    if (mediaConfig.metadata.isBlueRay == 'y') { mediaDirNameTemplate += ' (BR)' }
    return mediaDirNameTemplate
}

function buildMediaFileNameTemplate(mediaConfig) {
    let mediaFileNameTemplate = `${mediaConfig.metadata.title} (${mediaConfig.metadata.releaseYear}) (${mediaConfig.metadata.quality})`
    if (mediaConfig.metadata.isBlueRay == 'y') { mediaFileNameTemplate += ' (BR)' }
    mediaFileNameTemplate += `${mediaConfig.mediaFileExtension}`
    return mediaFileNameTemplate
}

async function askQuestion(question) {
    const prompter = readlinePromises.createInterface({
        input: process.stdin,
        output: process.stdout,
    
    })
    return new Promise(resolve => prompter.question(question, answer => {
        prompter.close()
        resolve(answer)
    }))
}

async function log(level, message) {
    const logLevels = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR']
    if (logLevels.indexOf(LOG_LEVEL) <= logLevels.indexOf(level)) {
        console.log(`${message}`)
    }
}

async function run() {
    const subDirs = await getFullyQualifiedSubDirs(SEARCH_DIR)
    log('DEBUG', `Found ${subDirs.length} sub-directories ...`)
    log('DEBUG', `${subDirs}`)
    for (const subDir of subDirs) {
        let mediaConfig = await interrogateMedia(subDir)
        mediaConfig.mediaRootPath = SEARCH_DIR
        await updateMedia(mediaConfig)
    }
}

exports.run = run