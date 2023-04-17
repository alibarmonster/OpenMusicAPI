const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(req, h) {
    this._validator.validateSongPayload(req.payload);

    const { title, year, performer, genre, duration, albumId } = req.payload;

    const songId = await this._service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    if (!songId) {
      throw new ClientError('Gagal menambahkan lagu', 400);
    }

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        songId,
      },
    });
    return response.code(201);
  }

  async getAllSongsHandler(req, h) {
    const { title, performer } = req.query;
    const songs = await this._service.getAllSong(title, performer);

    const response = h.response({
      status: 'success',
      value: songs.length,
      data: {
        songs,
      },
    });

    return response.code(200);
  }

  async getSongByIdHandler(req, h) {
    const { id } = req.params;

    const song = await this._service.getSongById(id);

    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });

    return response.code(200);
  }

  async updateSongByIdHandler(req, h) {
    this._validator.validateSongPayload(req.payload);

    const { id } = req.params;

    await this._service.updateSongById(id, req.payload);

    const songId = await this._service.getSongById(id);

    const response = h.response({
      status: 'success',
      message: 'Song berhasil diperbarui',
      data: {
        songId,
      },
    });

    return response.code(200);
  }

  async deleteSongByIdHandler(req, h) {
    const { id } = req.params;

    await this._service.deleteSongById(id);

    const response = h.response({
      status: 'success',
      message: 'Song berhasil dihapus',
    });

    return response.code(200);
  }
}

module.exports = SongHandler;
