const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const engines = require('consolidate');
const JSONStream = require('JSONStream');
const bodyParser = require('body-parser');
const User = require('./db').User;

app.engine('hbs',engines.handlebars);

// EH: my personal preference
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use('/profilepics', express.static(__dirname + '/images'));
app.use(bodyParser.urlencoded({ extended: true }));

// avoid fav.ico error
app.get('/favicon.ico', (req, res) => {
  res.end();
  console.log('working here')
})
  console.log('working here also')

/* app.get('/', function (req, res) {
  User.find({}, function (err, users) {

    console.log('this is where it broke?')
    res.render('index', {users: users})
    console.log('not working here')
  })
})
*/

 app.get('/', (req, res) => {
  const users = [];
  fs.readdir('users', (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf8'}, (err, data) => {
        if (err) throw err;
        const user = JSON.parse(data);
        user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
        users.push(user);
        if (users.length === files.length) res.render('index', {users: users});
      });
    });
  });
});

app.get('*.json', (req, res) => {
  res.download('./users/' + req.path, 'nvimrocks!.exe')
});

app.get('/data/:username', (req, res) => {
  const username = req.params.username;
  const readable = fs.createReadStream('./users/' + username + '.json');
  readable.pipe(res)
});

app.get('/users/by/:gender', (req,res) => {
  const gender = req.params.gender;
  const readable = fs.createReadStream('users.json')
  readable
    .pipe(JSONStream.parse('*'), (user) => {
      if (user.gender === gender) return user.name
    })
    .pipe(JSONStream.stringify('[\n ', ',\n ', '\n]\n'))
    .pipe(res)
});

app.get('/error/:username', (req, res) => {
  res.status(404).send('No user named ' + req.params.username + ' found')
});

const userRouter = require('./username');
app.use('/:username', userRouter);


const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:' + server.address().port)
});
