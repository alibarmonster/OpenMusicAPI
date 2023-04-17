const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(req, h) {
    this._validator.validateUserPayload(req.payload);

    const { username, password, fullname } = req.payload;
    const userId = await this._service.addUser({ username, password, fullname });

    if (!userId) {
      throw new ClientError('Gagal menambahkan user', 400);
    }

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    return response.code(201);
  }

  async getUserByIdHandler(req, h) {
    const { id } = req.params;

    const user = await this._service.getUserById(id);

    const response = h.response({
      status: 'success',
      data: {
        user,
      },
    });

    return response.code(200);
  }
}

module.exports = UserHandler;
