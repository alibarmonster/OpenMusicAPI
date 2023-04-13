const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(req, h) {
    this._validator.validateAlbumPayload(req.payload);

    const { name, year } = req.payload;

    const albumId = await this._service.addAlbum({ name, year });

    if (!albumId) {
      throw new ClientError('Gagal menambahkan album', 400);
    }

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    return response.code(201);
  }

  async getAlbumByIdHandler(req, h) {
    const { id } = req.params;

    const album = await this._service.getAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        album: album,
      },
    });

    return response.code(200);
  }

  async updateAlbumByIdHandler(req, h) {
    this._validator.validateAlbumPayload(req.payload);

    const { id } = req.params;

    await this._service.updateAlbumById(id, req.payload);

    const albumId = await this._service.getAlbumById(id);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diperbarui',
      data: {
        album: albumId,
      },
    });

    return response.code(200);
  }

  async deleteAlbumByIdHandler(req, h) {
    const { id } = req.params;

    await this._service.deleteAlbumById(id);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
    });

    return response.code(200);
  }
}

module.exports = AlbumsHandler;
