const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { mapDbToModel } = require('../utils/song-utils');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  addSong = async ({ title, year, performer, genre, duration, albumId }) => {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const query = await this._pool.query({
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId, insertedAt, updatedAt],
    });

    if (!query.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu');
    }

    return query.rows[0].id;
  };

  getAllSong = async (title, performer) => {
    const query = {
      text: 'SELECT id, title, performer FROM songs',
    };

    if (title || performer) {
      const filteredTitle = (title ? `%${title}%` : '%').toLowerCase();
      const filteredPerformer = (performer ? `%${performer}%` : '%').toLowerCase();
      query.text += ' WHERE title ILIKE $1 AND performer ILIKE $2';
      query.values = [filteredTitle, filteredPerformer];

      const result = await this._pool.query(query);
      return result.rows;
    }

    const result = await this._pool.query(query);
    return result.rows;
  };

  getSongById = async (id) => {
    const query = await this._pool.query({
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    });

    if (!query.rows.length) {
      throw new NotFoundError('Gagal mendapatkan id lagu');
    }

    return query.rows.map(mapDbToModel)[0];
  };

  updateSongById = async (id, { title, year, genre, performer, duration, albumId }) => {
    const query = await this._pool.query({
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    });

    if (!query.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu, ID tidak ditemukan');
    }
  };

  async deleteSongById(id) {
    const query = await this._pool.query({
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    });

    if (!query.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan', 404);
    }
  }
}

module.exports = SongService;
