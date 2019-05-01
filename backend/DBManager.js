const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Extend the default timeout so MongoDB binaries can download
jest.setTimeout(60000);

// List your collection names here
const COLLECTIONS = ['users', 'players', 'otw'];

class DBManager {
  constructor(port, dbName) {
    this.db = null;
    this.server = new MongoMemoryServer({
      instance: {
        port,
        dbName,
      }
    });
    this.connection = null;
  }

  async start() {
    const url = await this.server.getConnectionString();
    this.connection = await MongoClient.connect(url, { useNewUrlParser: true });
    this.db = this.connection.db(await this.server.getDbName());
  }

  stop() {
    this.connection.close();
    return this.server.stop();
  }

  cleanup() {
    return Promise.all(COLLECTIONS.map(c => this.db.collection(c).remove({})));
  }
}

module.exports = DBManager;