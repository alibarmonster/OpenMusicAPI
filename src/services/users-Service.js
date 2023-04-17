const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

const { hashPassword } = require('../helpers/bcrypt');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  addUser = async ({ username, password, fullname }) => {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await hashPassword(password);

    const query = await this._pool.query({
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    });

    if (!query.rows[0].id) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return query.rows[0].id;
  };

  verifyNewUsername = async (username) => {
    const query = await this._pool.query({
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    });

    if (query.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  };

  getUserById = async (userId) => {
    const query = await this._pool.query({
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    });

    if (!query.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return query.rows[0];
  };
}

module.exports = UsersService;
