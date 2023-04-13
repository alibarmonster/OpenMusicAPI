const AlbumsHandler = require('./handler-album');
const albumRoutes = require('./routes-album');

module.exports = {
  name: 'albums',
  version: '0.0.1',
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumsHandler(service, validator);
    server.route(albumRoutes(albumHandler));
  },
};
