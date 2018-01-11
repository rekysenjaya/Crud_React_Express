var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var SaltLength = 9;

function createHash(password) {
  var salt = generateSalt(SaltLength);
  var hash = md5(password + salt);
  return salt + hash;
}

function validateHash(hash, password) {
  var salt = hash.substr(0, SaltLength);
  var validHash = salt + md5(password + salt);
  console.log(hash, '==', validHash)
  return hash === validHash;
}

function generateSalt(len) {
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
    setLen = set.length,
    salt = '';
  for (var i = 0; i < len; i++) {
    var p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}

function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

router.use(function (req, res, next) {
  var db = req.con;
  console.log(createHash('tes'))
  
  if (!req.headers.token == false)
    if ('register' === req.headers.token) {
      if (true) {
        next();
      } else {
        res.json({ 'message': 'not access', 'session': 'destroy' });
      }
    } else {
      // check token
      const token = req.headers.token;
      var decrypted = req.encryptor.decrypt(token);

      const d = db.query(`SELECT * FROM user WHERE email = '${decrypted.email}'`, function (err, rows) {
        if (err) return next(err);
        if (rows.length >= 1) {
          next();
        } else {
          res.json({ 'message': 'not access', 'session': 'destroy' });
        }
      });
    }
  else
    res.json({ 'message': 'not access token', 'session': 'destroy' });
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  var db = req.con;
  var data = "";
  db.query('SELECT * FROM user', function (err, rows) {
    if (err) return next(err);
    res.json(rows);
  });
});

router.get('/:id', function (req, res, next) {
  var db = req.con;
  var data = "";
  db.query(`SELECT * FROM user WHERE id = '${req.params.id}'`, function (err, rows) {
    if (err) return next(err);
    res.json(rows);
  });
});

// create user
router.post('/', function (req, res, next) {
  req.body.password = createHash(req.body.password);
  var db = req.con;
  var data = "";
  db.query(`SELECT * FROM user WHERE email = '${req.body.email}'`, function (errs, rows) {
    if (errs) return next(errs);

    if (rows.length < 1) {
      db.query('INSERT INTO user set ? ', req.body, function (err, row) {
        if (err) return next(err);

        if (row.protocol41)
          return res.json({ 'messageReg': `successfully registered ${req.body.email}` });
      });
    } else {
      return res.json({ 'messageReg': 'email already exists!', 'token': false });
    }
  });
});

// login user
router.post('/login', function (req, res, next) {
  var db = req.con;
  var data = "";
  var qur = db.query(`SELECT * FROM user WHERE email = '${req.body.email}'`, function (err, rows) {
    if (err) return next(err);

    if (rows.length > 0)
      if (validateHash(rows[0].password, req.body.password)) {
        return res.json(Object.assign({}, { 'message': 'success', 'token': req.encryptor.encrypt(rows[0]) }, rows[0]));
      } else {
        return res.json({ 'message': 'not success', 'token': false });
      }
    else
      return res.json({ 'message': 'not success', 'token': false });
  });
  console.log(qur.sql)
});


router.put('/:id', function (req, res, next) {
  if (typeof req.body.password !== 'undefined')
    req.body.password = createHash(req.body.password);
  var db = req.con;
  db.query('UPDATE user set ? WHERE id = ?', [req.body, req.params.id], function (err, rows) {
    if (err) return next(err);

    res.json(rows);
  });
});

router.delete('/:id', function (req, res, next) {
  var db = req.con;
  var data = "";
  db.query(`DELETE FROM user WHERE id = '${req.params.id}'`, function (err, rows) {
    if (err) return next(err);
    res.json(rows);
  });
});

router.post('/login', function (req, res, next) {
  var db = req.con;
  var password = req.params.password;
  db.query('SELECT * FROM user WHERE email = ? AND password = ?', [req.body.email, password], function (err, rows) {
    if (err) return next(err);
    res.json(rows);
  });
});

module.exports = router;
