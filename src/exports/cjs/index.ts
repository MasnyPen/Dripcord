module.exports = {
    DripcordFramework: require('./src/DripcordFramework.js'),
    Bot: require('../../BotClient.js'),
    Event: require('./handlers/Event/Event.js'),
    Command: require('./handlers/Commands/Command.js'),
    CacheDriver: require('./drivers/cache/CacheDriver.js'),
    LocalDriver: require('./drivers/cache/LocalDriver.js'),
    RedisDriver: require('./drivers/cache/RedisDriver.js'),
    discord: require('discord.js'),
    mongoose: require('mongoose'),
    DatabaseDriver: require('../../drivers/database/DatabaseDriver.js'),
    PgDatabaseDriver: require('../../drivers/database/PgDriver.js'),
    MySQLDatabaseDriver: require('../../drivers/database/MysqlDriver.js'),
    MongoDatabaseDriver: require('../../drivers/database/MongoDriver.js'),
    SQLiteDatabaseDriver: require('../../drivers/database/SqliteDriver.js')
  };
  