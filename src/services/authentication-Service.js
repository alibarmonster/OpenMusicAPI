const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  addRefreshToken = async (token) => {
    const query = await this._pool.query({
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    });
  };

  verifyRefreshToken = async (token) => {
    const query = await this._pool.query({
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    });

    if (!query.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  };

  deleteRefreshToken = async (token) => {
    await this.verifyRefreshToken(token);
    const query = await this._pool.query({
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    });
  };
}

module.exports = AuthenticationsService;
