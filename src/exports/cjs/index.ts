module.exports = {
    DripcordFramework: require('../../DripcordFramework.js'),
    Bot: require('../../BotClient.js'),
    Event: require('../../handlers/Event/Event.js'),
    Command: require('../../handlers/Commands/Command.js'),
    
    CacheDriver: require('../../drivers/cache/CacheDriver.js'),
    LocalDriver: require('../../drivers/cache/LocalDriver.js'),
    RedisDriver: require('../../drivers/cache/RedisDriver.js'),

    discord: require('discord.js'),

    DatabaseDriver: require('../../drivers/database/DatabaseDriver.js'),
    MySQLDatabaseDriver: require('../../drivers/database/MysqlDriver.js'),
    SQLiteDatabaseDriver: require('../../drivers/database/SqliteDriver.js')
  };
  