const MongoClient = require('mongodb').MongoClient;

const mongoConfig = {
  "serverUrl": "mongodb+srv://kishan:kishan@locationtoip-bqvuk.mongodb.net/test?retryWrites=true&w=majority",
  "database": 'QuoraFlow_DB'
};

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl,{useUnifiedTopology: true});
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};
