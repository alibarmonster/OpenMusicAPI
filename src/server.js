const Hapi = require('@hapi/hapi');

const dotenv = require('dotenv');

dotenv.config();

// albums
const albums = require('./api/albums/index-album');
const AlbumsService = require('./services/album-Service');
const AlbumsValidator = require('./validator/albums/index-album');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumsService = new AlbumsService();
  const server = Hapi.server({
    port: process.env.PORT !== undefined ? process.env.PORT : 3000,
    host: process.env.HOST !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          statusCode: response.statusCode,
          status: 'fail',
          message: response.message,
        });
        return newResponse.code(response.statusCode);
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        statusCode: 500,
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      return newResponse.code(500);
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();

  console.log(`Server running on ${server.info.uri}`);
};

init();
