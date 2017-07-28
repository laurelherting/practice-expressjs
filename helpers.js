const fs = require('fs');
const path = require('path');
const _ = require('lodash');

function getUser (username) {
  const user = JSON.parse(fs.readFileSync(getUserFilePath(username), {encoding: 'utf8'}));
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
  _.keys(user.location).forEach((key) => {
    user.location[key] = _.startCase(user.location[key])
  });
  return user
};

function getUserFilePath (username) {
  return path.join(__dirname, 'users', username) + '.json'
};

function saveUser (username, data) {
  const fp = getUserFilePath(username);
  fs.unlinkSync(fp) // delete file
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), {encoding: 'utf8'});
};

function verifyUser (req, res, next) {
  const fp = getUserFilePath(req.params.username);

  fs.exists(fp, (yes) => {
    if (yes) {
      next()
    } else {
      res.redirect('/error/' + req.params.username)};
  });
};

exports.getUser = getUser;
exports.getUserFilePath = getUserFilePath;
exports.saveUser = saveUser;
exports.verifyUser = verifyUser;
