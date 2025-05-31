module.exports = {
    Bot: require('../../interfaces/Bot.js'),
    initShard: require('../../BotClient.js'),
    Event: require('../../handlers/Event/Event.js'),
    Command: require('../../handlers/Commands/Command.js'),
    Plugin: require('../../interfaces/Plugin.js'),

    i18n: require('../../utils/i18n.js'),
    Translate: require('../../utils/i18n.js'),

    Logger: require('../../utils/Logger.js'),

    CacheDriver: require('../../drivers/cache/CacheDriver.js'),
    LocalDriver: require('../../drivers/cache/LocalDriver.js'),
    RedisDriver: require('../../drivers/cache/RedisDriver.js'),


    DatabaseDriver: require('../../drivers/database/DatabaseDriver.js'),
    MySQLDatabaseDriver: require('../../drivers/database/MysqlDriver.js'),
    SQLiteDatabaseDriver: require('../../drivers/database/SqliteDriver.js')
  };
  