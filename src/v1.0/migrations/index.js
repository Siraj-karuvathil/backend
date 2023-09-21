const logger = require("../../utils/logger");
const { Migration } = require("../models");
const migrations = require("require-all")({
    dirname: __dirname,
    filter: /^(migration.+)\.js$/,
    excludeDirs: /^\.(git|svn)$/,
    recursive: false,
});

// error handler
function errorHandler(error) {
    console.log("Error occured during migration.");
    console.log(error);
    logger.error({
        message: "Migration error",
        error,
    });
}

// get next batch number
async function getNextBatch() {
    const lastBatchMigration = await Migration.findOne().sort("-batch");
    return lastBatchMigration ? lastBatchMigration.batch + 1 : 1;
}

// check whether migration already
async function isMigrationCompleted(fileName) {
    const migration = await Migration.findOne({ fileName });
    return migration ? true : false;
}

// saving migration document
async function saveMigrationDocument(fileName, batch) {
    const migration = new Migration({
        fileName,
        batch,
    });

    await migration.save();
}

// migrating current migration file
async function migrate(fileName, batch, migration) {
    if (migration.hasOwnProperty("execute")) {
        console.log("Migrating " + fileName + "...");
        await migration.execute();
        await saveMigrationDocument(fileName, batch);
        console.log(fileName + " migrated.");
        return true;
    }

    return false;
}

// run migrations
async function runMigrations() {
    try {
        console.log("Starting migrations...");
        let counter = 0;
        let batch = await getNextBatch();
        for (const fileName in migrations) {
            if (migrations.hasOwnProperty(fileName)) {
                const migrationCompleted = await isMigrationCompleted(fileName);
                if (!migrationCompleted) {
                    const migration = migrations[fileName];
                    if (await migrate(fileName, batch, migration)) {
                        counter++;
                    }
                }
            }
        }

        console.log(counter > 0 ? "Migrations completed." : "Nothing to migrate !");
    } catch (error) {
        errorHandler(error);
    }
}

module.exports = {
    runMigrations,
};
