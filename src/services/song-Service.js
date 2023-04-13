const { Pool } = require('pg');

class SongService {
  constructor() {
    this.pool = new Pool();
  }
}

module.exports = SongService;
