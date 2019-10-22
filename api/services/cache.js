const redis = require("redis");
const Logger = require('@logger');

const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const password = process.env.REDIS_PASSWORD;
if (!host) throw new Error("Missing env variable REDIS_HOST");
if (!port) throw new Error("Missing env variable REDIS_PORT");
if (!password) throw new Error("Missing env variable REDIS_PASSWORD");

const client = redis.createClient({
    host,
    port,
    password
});

const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

client.on("error", function (err) {
    Logger.error(`CACHE\tRedis unreachable {${err}}`)
});
client.on("ready", function () {
    Logger.info(`CACHE\tRedis up and running`)
});

class CacheClient {
    static get(key) {
        return getAsync(key).then((data) => {
            return JSON.parse(data);
        });
    }

    static set(key, value) {
        return setAsync(key, JSON.stringify(value));
    }
}

module.exports = CacheClient;

// redis-cli -h redis-16640.c15.us-east-1-4.ec2.cloud.redislabs.com -p 16640 -a password
