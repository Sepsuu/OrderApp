'use strict';

const Validator = require('validator');

const utils = require('../utils/writer.js');
const User  = require('../service/UserService');


module.exports.createUser = function createUser (req, res, next) {

  var user = req.swagger.params['body'].value;

  const { errors, valid } = validateRegisterInput(user);

  if (!valid) {
    utils.writeJson(res, {status: 400, errors: errors});
    return;
  }


  User.createUser(user)
  .then(function (response) {
    utils.writeJson(res, response);
  })
  .catch(function (response) {
    utils.writeJson(res, response);
  });


};

module.exports.deleteUser = function deleteUser (req, res, next) {
  var username = req.swagger.params['username'].value;
  // We want ensure that user is logged and is trying to delete him/herself
  var reqUsername = req.auth['name'];

  if (username != reqUsername)
  {
    sendError();
    return;
  }


  User.deleteUser(username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserByName = function getUserByName (req, res, next) {
  if (!req.auth)
  {
    sendError();
    return;
  }


  var username = req.swagger.params['username'].value;
  var reqUsername = req.auth['name'];

  if (username != reqUsername)
  {
    sendError();
    return;
  }


  if (username == undefined)
  {
    utils.writeJson(res, 400, "Invalid username supplied");
  }

  User.getUserByName(username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.loginUser = function loginUser (req, res, next) {

  var user = req.swagger.params['user'].value;
  const { errors, valid } = validateLoginInput(user);
  if(!valid) {
    utils.writeJson(res, {status: 404, description: errors});
  }
  
  User.loginUser(user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.logoutUser = function logoutUser (req, res, next) {

  User.logoutUser(req)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateUser = function updateUser (req, res, next) {
  var username = req.swagger.params['username'].value;
  var body = req.swagger.params['body'].value;
  var reqUsername = req.auth['name'];

  if (username != reqUsername){ sendError(); return;}

  User.updateUser(username,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

const sendError = () =>
{
  var response = utils.respondWithCode(401, "Access denied");
  utils.writeJson(res, response);
}


const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
}



const validateRegisterInput = (rawData) => {
  console.log("asdasdasdasd");
  console.log(rawData);
    let errors = {};
    rawData.username = !isEmpty(rawData.username) ? rawData.username : '';
    rawData.email= !isEmpty(rawData.email) ? rawData.email : '';
    rawData.password = !isEmpty(rawData.password) ? rawData.password : '';


    if(!Validator.isLength(rawData.username, { min: 2, max: 30 })) {
        errors.name = 'Name must be between 2 to 30 chars';
    }

    if(Validator.isEmpty(rawData.username)) {
        errors.name = 'Name field is required';
    }

    if(!Validator.isEmail(rawData.email)) {
        errors.email = 'Email is invalid';
    }

    if(Validator.isEmpty(rawData.email)) {
        errors.email = 'Email is required';
    }

    if(Validator.isEmpty(rawData.password)) {
        errors.password = 'Password is required';
    }


    return {
        errors,
        valid: isEmpty(errors)
    }
}

const validateLoginInput = (data) => {
    let errors = {};
    data.username = !isEmpty(data.username) ? data.username : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(!Validator.isLength(data.username, { min: 2, max: 30 })) {
        errors.name = 'Name must be between 2 to 30 chars';
    }

    if(Validator.isEmpty(data.username)) {
        errors.name = 'Name field is required';
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    return {
        errors,
        valid: isEmpty(errors)
    }
}