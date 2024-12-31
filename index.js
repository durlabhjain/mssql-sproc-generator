const fs = require('fs-extra');
const path = require('path');

// Path to the directory containing JavaScript files
const scriptsFolder = path.resolve(__dirname, '.');

const logger = console;

// Dynamically load all JavaScript files recursively
const loadScripts = (folderPath) => {
    const loadedModules = {};

    // Read all files and directories in the folder
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });

    entries.forEach(entry => {
        const fullPath = path.join(folderPath, entry.name);

        if (entry.isDirectory()) {
            const subPath = path.join(folderPath, entry.name, "generators", "app");
            if (fs.existsSync(subPath) && fs.existsSync(path.join(subPath, "index.js"))) {
                logger.log(`Loading ${entry.name}...`)
                const moduleName = entry.name;
                loadedModules[moduleName] = require(path.join(subPath, "index.js"));
            }
        }
    });

    return loadedModules;
};


const generators = loadScripts(scriptsFolder);

const generator = "mssql-sproc";

const instance = new generators[generator]();

const app = async function () {

    await instance.prompting();
    await instance.writing();
}

app();