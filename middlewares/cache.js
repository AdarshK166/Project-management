const redis = require("redis");
const client = redis.createClient();

client.on("error", (err) => {
  console.error("Redis error:", err);
});

const cache = (req, res, next) => {
  const { page = 1, limit = 10, sort = "createdAt", order = "ASC" } = req.query;
  const key = `projects:${page}:${limit}:${sort}:${order}`;

  client.get(key, (err, data) => {
    if (err) {
      console.error(err);
      return next();
    }
    if (data) {
      return res.status(200).json(JSON.parse(data));
    }
    next();
  });
};

const cacheResponse = (key, data) => {
  client.setex(key, 3600, JSON.stringify(data));
};

module.exports = { cache, cacheResponse };
