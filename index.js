let express = require('express')
let app = express()

let fs = require('fs')
let _ = require('lodash')
let engines = require('consolidate')

let users = []

fs.readFile('users.json', {encoding: 'utf8'}, function (err, data) {
  if (err) throw err

  JSON.parse(data).forEach(function (user) {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
    users.push(user)
  })

})

app.engine('hbs',engines.handlebars)

app.set('views', __dirname + '/views')
app.set('view engine', 'hbs')

app.use('/profilepics', express.static(__dirname + '/images'));

app.get('/', function (req, res) {
  res.render('index', {users: users})
})

app.get('/:username', function (req, res) {
  console.log('username', req.params.username);
  if (req.params.username === 'favicon.ico') {
    return;
  }
  let username = req.params.username
  let userData = users.find(u => {
    if (u.username === username) {
      return u;
    }
  });
  console.log('userData', userData);
  res.render('user', {user: userData})
})

let server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port)
})
