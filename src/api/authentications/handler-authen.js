const autoBind = require('auto-bind');
const { ref } = require('joi');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(req, h) {
    this._validator.validatePostAuthenticationPayloadSchema(req.payload);

    const { username, password } = req.payload;

    const id = await this._usersService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ id });

    const refreshToken = this._tokenManager.generateRefreshToken({
      id,
    });

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    return response.code(201);
  }

  async putAuthenticationHandler(req, h) {
    this._validator.validatePutAuthenticationPayloadSchema(req.payload);

    const { refreshToken } = req.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);

    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });

    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(req, h) {
    this._validator.validateDeleteAuthenticationPayloadSchema(req.payload);

    const { refreshToken } = req.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);

    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh Token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
