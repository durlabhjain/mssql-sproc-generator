const Generator = require('../../generator');
const sql = require('mssql');

module.exports = class extends Generator {
    async prompting() {
        // Check if configuration exists
        const savedConfig = this.config.get('sqlConfig') || {};

        // Prompt for missing connection parameters
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'server',
                message: 'SQL Server address',
                default: savedConfig.server || 'localhost',
            },
            {
                type: 'input',
                name: 'database',
                message: 'Database name',
                default: savedConfig.database || 'TestDB',
            },
            {
                type: 'input',
                name: 'user',
                message: 'Username',
                default: savedConfig.user || 'sa',
            },
            {
                type: 'password',
                name: 'password',
                message: 'Password',
                mask: '*',
                default: savedConfig.password || '',
            },
            {
                type: 'input',
                name: 'tableName',
                message: 'Table name',
                default: savedConfig.tableName,
            },
            {
                type: 'checkbox',
                name: 'operations',
                message: 'Select operations to generate:',
                choices: ['Add', 'Update', 'Delete'],
                default: ['Add'],
            },
        ]);

        console.log(this.answers);

        // Save SQL configuration for future runs
        this.config.set('sqlConfig', {
            server: this.answers.server,
            database: this.answers.database,
            user: this.answers.user,
            password: this.answers.password,
            tableName: this.answers.tableName
        });

        this.log('Configuration saved');
    }

    async writing() {
        const config = {
            user: this.answers.user,
            password: this.answers.password,
            server: this.answers.server,
            database: this.answers.database,
            options: {
                encrypt: false,
                trustServerCertificate: true,
            },
        };

        try {
            // Connect to SQL Server
            const pool = await sql.connect(config);

            // Query the table schema
            const tableName = this.answers.tableName;
            const result = await pool.request()
                .query(`SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}' ORDER BY ORDINAL_POSITION`);

            const columns = result.recordset.map(row => ({
                name: row.COLUMN_NAME,
                type: this.mapSqlToType(row.DATA_TYPE),
            }));

            // Process selected operations
            const templateData = { tableName, columns };
            const operations = this.answers.operations;

            this.log('Running generators');

            for (const operation of operations) {
                const templateFile = `${operation.toLowerCase()}.sql`;
                await this.fs.copyTpl(
                    this.templatePath(templateFile),
                    this.destinationPath(`${operation.toLowerCase()}_${tableName}.sql`),
                    templateData
                );
            }
            this.log(`Stored procedures (${operations.join(', ')}) for table ${tableName} have been generated.`);
        } catch (error) {
            this.log('Error connecting to SQL Server:', error.message);
        } finally {
            sql.close();
        }
    }

    mapSqlToType(sqlType) {
        const typeMap = {
            'nvarchar': 'NVARCHAR(MAX)',
            'varchar': 'VARCHAR(MAX)',
            'int': 'INT',
            'datetime': 'DATETIME',
            'bit': 'BIT',
        };
        return typeMap[sqlType.toLowerCase()] || sqlType.toUpperCase();
    }
};
