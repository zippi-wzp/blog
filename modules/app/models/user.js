var express = require('express');
var crypto = require('crypto');
var async = require('async');
var util = require('util');
var HttpError = require('../error').HttpError;

function User (username, password, email) {
  var now = new Date ();
  var isoDate = new Date(now).toISOString();
  this.username = username;
  this.email = email;
  this.salt = Math.random() + '';
  this.hashed_password = this.encryptPassword(password);
  this.role = 'customer';
  this.createdAt = isoDate;
  this.modifiedAt = isoDate;
};
User.prototype.encryptPassword = function (password) { //hashing password
  if (!this.salt) {
    return crypto.createHmac('sha1', this.salt_password).update(password).digest('hex');
  } else {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  }
};
User.prototype.checkPassword = function (password) {
  if (this.hashed_password === User.prototype.encryptPassword.call(this, password)) {
    return this;
  } else {
    return false;
      // throw new Error("Your password may be are not be valid");
  }
};

User.authorize = function (username, password, users, callback) {
  var username = username;
  var password = password;
  var users = users; //variable for interface from model database - users
  var User = this;
  async.waterfall([
    function (callback) {
      users.read(username, function (err, data) {
        if (err) {
          return callback(err);
        } else {
          callback(null, data);
        }
      });
    },
    function (user, callback) {
      if (user.length !== 0) {
        if (User.prototype.checkPassword.call(user[0], password)) {
          callback(null, user);
        } else {
          return callback(new AuthError("Incorrect password. Check the right of your data!"));
        }
      } else {
        return callback(new AuthError("Your username may be are not valid. Maybe you are not registered!"));
      }
    }
  ], callback);
};

User.register = function (username, password, email, users, callback) {
  var username = username;
  var password = password;
  var email = email;
  var users = users; //variable for interface from model database - users
  var User = this;
  var user = new User(username, password, email);
  users.create(user.username, user.email, user.salt, user.hashed_password, user.role, user.createdAt, user.modifiedAt, function (err, data) {
    if (err) {
      return callback(new HttpError(409, "The user with this username has been registered! Please, input another username."));
    } else {
      return callback(null, data);
    }
  });
};

exports.User = User;

function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);

  this.message = message;
}
util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;
