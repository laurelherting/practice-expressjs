const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const engines = require('consolidate');
const bodyParser = require('body-parser');

function getUser(username) {
  const user = JSON.parse(fs.readFileSync(getUserFilePath(username, { encoding: 'utf8' })));
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
  _.keys(user.location).forEach((key) => {
    user.location[key] = _.startCase(user.location[key]);
  });
  return user;
};

function getUserFilePath(username) {
  return path.join(__dirname, 'users', username) + '.json';
};

function saveUser(username, data) {
  const fp = getUserFilePath(username);
  fs.unlinkSync(fp) // delete the file
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), {encoding: 'utf8'})
};

function verifyUser (req, res, next) {
  const fp = getUserFilePath(req.params.username);
  
  fs.exists(fp, (yes) => {
    if(yes) {
      next()
    } else {
      res.redirect('/error/' + req.params.username)};
  });
};

app.engine('hbs',engines.handlebars);

// EH: my personal preference
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use('/profilepics', express.static(__dirname + '/images'));
app.use(bodyParser.urlencoded({ extended: true }));

// avoid fav.ico error
app.get('/favicon.ico', (req, res) => {
  res.end();
});

app.get('/', (req, res) => {
  const users = [];
  fs.readdir('users', (err, files) => {
    console.log('files', files);
    if (err) throw err;
    files.forEach((file) => {
      console.log('file', file);
      fs.readFile(path.join(__dirname, 'users', file), { encoding: 'utf8' }, (err, data) => {
        if (err) throw err;
        const user = JSON.parse(data);
        // console.log('user', user.username);
        user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
        users.push(user);
        console.log('users', users.length);
        if (users.length === files.length) res.render('index', { users: users });
      });
    });
  });
});

app.get('*.json', (req, res) => {
  res.download('./users/' + req.path, 'nvimrocks!.exe')
});

app.get('/data/:username', (req, res) => {
  const username = req.params.username
  const user = getUser(username)
  res.json(user)
});

app.get('/error/:username', (req, res) => {
  res.status(404).send('No user named ' + req.params.username + ' found')
});

app.all('/:username', (req, res, next) => {
  console.log(req.method, 'for', req.params.username);
  next()
});

app.get('/:username', verifyUser, (req, res) => {
  const username = req.params.username;
  const user = getUser(username);
  res.render('user', {
    user: user,
    address: user.location
  });
});

app.put('/:username', (req, res) => {
  const username = req.params.username;
  const user = getUser(username);
  user.location = req.body;
  saveUser(username, user);
  res.end(); 
});

app.delete('/:username', (req,res) => {
  const fp = getUserFilePath(req.params.username);
  fs.unlinkSync(fp) // delete the file
  res.sendStatus(200)
});

let server = app.listen(3000, () => {
  console.log('Server running at http://localhost:' + server.address().port)
});
