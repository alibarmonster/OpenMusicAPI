const bcrypt = require('bcrypt');

const hashPassword = (userPassword) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(userPassword, salt);
  return hashedPassword;
};

const checkPassword = (userPassword, hashedPassword) => {
  return bcrypt.compareSync(userPassword, hashedPassword);
};

module.exports = { hashPassword, checkPassword };
