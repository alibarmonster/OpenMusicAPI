const UserHandler = require('./handler-user');
const userRoutes = require('./routes-user');

module.exports = {
  name: 'users',
  version: '0.0.1',
  register: async (server, { service, validator }) => {
    const userHandler = new UserHandler(service, validator);
    server.route(userRoutes(userHandler));
  },
};
