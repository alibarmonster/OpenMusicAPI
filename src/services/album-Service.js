const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { mapDBToModel } = require('../utils/album-utils');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  addAlbum = async ({ name, year }) => {
    const id = `album-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const query = await this._pool.query({
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, insertedAt, updatedAt],
    });

    if (!query.rows[0].id) {
      throw new InvariantError('Gagal menambahkan album');
    }

    return query.rows[0].id;
  };

  getAlbumById = async (id) => {
    const query = await this._pool.query({
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    });

    if (!query.rows.length) {
      throw new NotFoundError('Gagal mendapatkan Id album');
    }

    return query.rows.map(mapDBToModel)[0];
  };

  getSongsByAlbumId = async (albumId) => {
    const query = await this._pool.query({
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [albumId],
    });

    return query.rows;
  };

  updateAlbumById = async (id, { name, year }) => {
    const query = await this._pool.query({
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    });

    if (!query.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  };

  deleteAlbumById = async (id) => {
    const query = await this._pool.query({
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    });

    if (!query.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan', 404);
    }
  };
}
module.exports = AlbumService;
