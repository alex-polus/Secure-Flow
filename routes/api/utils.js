const uuidAPIKey = require("uuid-apikey");

exports.createKey = () => uuidAPIKey.create();
exports.getValue = (key) => {
  return uuidAPIKey.toUUID(key);
};
exports.getKey = (uuid) => {
  return uuidAPIKey.toAPIKey(uuid);
};
