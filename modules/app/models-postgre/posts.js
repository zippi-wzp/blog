var pgp = require('pg-promise')();

var client = undefined;
module.exports.connect = function (dbStr, callback) {
  try {
    client = pgp(dbStr);
  } catch (err) {
    callback(err);
  }
}

module.exports.disconnect = function(callback) {
  callback();
}

module.exports.create = function (title, body, callback) {
  client.query("insert into posts(title, body) values($1, $2) returning id", [title, body]).then(function (id) {
    callback(null, id)
  }).catch(function (err) {
    callback(err);
  });
}

module.exports.update = function (key, title, body, callback) {
  client.query("select * from posts where id=$1", [key]).then(function (data) {
    if (data.length !== 0) {
      client.query("update posts set title=$1, body=$2 where id=$3", [title, body, key]).then(function () {
        callback(null);
      }).catch(function (err) {
        callback(err);
      });
    } else {
      throw err;
    }
  }).catch(function (err) {
    callback(err);
  });
}

module.exports.read = function (key, callback) {
  client.query("select * from posts where id=$1", [key]).then(function (data) {
    if (data.length !== 0) {
      callback(null, data);
    } else {
      throw err; 
    }
  }).catch(function (err) {
    callback(err);
  });
}

module.exports.destroy = function (key, callback) {
  client.query("select * from posts where id=$1", [key]).then(function (data) {
    if (data.length !== 0) {
      client.query("delete from posts where id = $1", [key]).then(function () {
        callback(null);
      }).catch(function (err) {
        callback(err);
      });
    } else {
      throw err;
    }
  }).catch(function (err) {
    callback(err);
  });
}

module.exports.titles = function (callback) {
  var titles = [];
  client.any("select id, title,  created_at from posts").then(function (data) {
    data.forEach(function(row) {
      titles.push({id: row.id, title: row.title, createdAt: row.created_at});
    });
  }).catch(function (err) {
    callback(err);
  }).then(function () {
    callback(null, titles);
  });
}
