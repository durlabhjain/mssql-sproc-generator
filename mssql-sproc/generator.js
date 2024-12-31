const inquirer = require('inquirer');
const ejs = require('ejs');
const fs = require('fs-extra');
const path = require('path');
const logger = console;

class Config {
    config = {

    };

    constructor(options) {
        this.options = { configFile: './output/config.json', ...options };
        this.loadConfig();
    }

    saveConfig() {
        const { configFile } = this.options;
        fs.writeJSONSync(configFile, this.config, { spaces: 4 });
        console.log(`Configuration saved to ${configFile}`);
    };

    loadConfig() {
        const { configFile } = this.options;
        if (fs.existsSync(configFile)) {
            this.config = fs.readJSONSync(configFile);
        }
    };

    set(key, value) {
        this.config[key] = value;
        this.saveConfig();
    }

    get(key, defaultValue) {
        if (this.config.hasOwnProperty(key)) {
            return this.config[key];
        }
        return defaultValue;
    }

    getAll() {
        return this.config;
    }
}

const fsMixIn = {
    copyTpl: async function (source, target, templateData) {
        result = await ejs.renderFile(source, templateData, { async: false });
        fs.writeFileSync(target, result);
    }
}

class Generator {

    config = null;

    fs = { ...fs, ...fsMixIn };

    basePath = __dirname;

    logger = logger;

    log = logger.log;

    error = logger.error;

    prompt = inquirer.default.prompt;

    config = new Config();

    templatePath(templateName) {
        return path.join(this.basePath, "generators", "app", "templates", templateName);
    }

    destinationPath(fileName) {
        return path.join(".", "output", fileName);
    }

    constructor() {
    }

    async prompting() {

    }

    async writing() {

    }
}

module.exports = Generator;