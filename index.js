let express = require('express')
let app = express()

let fs = require('fs')
let _ = require('lodash')
let users = []

fs.readFile('users.json', {encoding: 'utf8'}, function (err, data) {
  if (err) throw err

  JSON.parse(data).forEach(function (user) {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
    users.push(user)
  })

})

app.set('views', './views')
app.set('view engine', 'jade')

app.get('/', function (req, res) {
  res.render('index', {users: users})
})

app.get(/gizmo.*/, function (req, res, next) {
  console.log('GIZMO USER ACCESS')
  next()
})

app.get(/.*cat.*/, function (req, res, next) {
  console.log('CATS MEOW')
  next()
})

app.get('/:username', function (req, res) {
  let username = req.params.username
  res.send(username)
})

let server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port)
})
