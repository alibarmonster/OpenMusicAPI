const SongHandler = require('./handler-song');
const songRoutes = require('./routes-song');

module.exports = {
  name: 'songs',
  version: '0.0.1',
  register: async (server, { service, validator }) => {
    const songHandler = new SongHandler(service, validator);
    server.route(songRoutes(songHandler));
  },
};
