'use strict';
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
var User     = require('../models/User');
var dotenv   = require('dotenv').config();


const SHARED_SECRET = process.env.SECRET


/**
 * Create user
 * This can only be done by the logged in user.
 *
 * body User Created user object
 * no response value expected for this operation
 **/
exports.createUser = function(body) {
  return new Promise(function(resolve, reject) {

    // Find user from the database, if found new user cannot be created.
    User.findOne({username:body.username}).then((user) => {
        if (user) 
        {
            reject({status: 400, description: 'Username already exists'});
        }
        else 
        {
            // Create new user object
            const userData = {
                email: body.email,
                id: body.id,
                username: body.username,
                password: body.password,
            }
            const newUser = new User(userData);

            // Crypt+hash password
            bcrypt.genSalt(10, (err, salt) => 
            {
                if(err) 
                {
                    console.error('There was an error', err);
                }
                else 
                {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) {
                            console.error('There was an error', err);
                        }
                        else 
                        {
                            // Save user to databse with hashed password
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    resolve(user);
                                }).catch((err) => {
                                    reject({status: 400, description: err});
                                }); 
                        }
                    });
                }
            });
        }

        
    }).catch((err) => {
        reject({status: 400, description: err});
    })

    });
}


/**
 * Delete user
 * This can only be done by the logged in user.
 *
 * username String The name that needs to be deleted
 * no response value expected for this operation
 **/
exports.deleteUser = function(username) {
  return new Promise(function(resolve, reject) {
    User.findOneAndDelete({username:username}, (err,result) => {
        if (err) {
            reject({status:400, description: "Invalid username supplied"});
        }

        if (result == null) {
            reject({status:404, description: "User not found"});
        }
    });
    resolve({status: 200, description:"Success"});
  });
}


/**
 * Get user by user name
 *
 * username String The name that needs to be fetched. Use user1 for testing.
 * returns User
 **/
exports.getUserByName = function(username) {
  return new Promise(function(resolve, reject) {
    // Find user by username from database
    User.findOne({username:username}).exec((err, user) => {
        if (err)
        {
            reject({status:400, description: "Invalid username supplied"});
        }

        if (user == null) 
        {
            reject({status:404, description: "User not found"});
        }

        resolve(user);
    });
  });
}


/**
 * Logs user into the system
 *
 * user User The user for login
 * returns String
 **/
exports.loginUser = function(req) {
  return new Promise(function(resolve, reject) {
    // Find user from database
    User.findOne({username : req.username})
        .then(user => {

            if(!user) 
            {
                reject({status:404, description: {'name':'Username or password wrong'}});
            }
            
            // Compare passwords
            bcrypt.compare(req.password, user.password)
                .then((isMatch) => 
                {
                    
                    if(isMatch) 
                    {
                        // passwords match
                        // Create new JSON Web Token
                        const payload = {
                                id: user._id,
                                name: user.username,
                            }
                            jwt.sign(payload, SHARED_SECRET, {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) 
                                {
                                    console.error('There is some error in token', err);
                                }
                                else 
                                {
                                    resolve({status: 200, token: token});
                                }
                            });
                    }
                    else {
                        reject({status:400, description: {'name':'Invalid username/password supplied'}});
                    }
                    });
                }).catch((err) => {
                reject({status:400, description: {'name':'Invalid username/password supplied'}});
            });
  });
}


/**
 * Logs out current logged in user session
 *
 * no response value expected for this operation
 **/
exports.logoutUser = function(req) {
  return new Promise(function(resolve, reject) {
    req.logout();
    resolve();
  });
}


/**
 * Updated user
 * This can only be done by the logged in user.
 *
 * username String name that need to be updated
 * body User Updated user object
 * no response value expected for this operation
 **/
exports.updateUser = function(username,body) {
  return new Promise(function(resolve, reject) {
    User.findOne({username:username}).exec((err, user) => {
        if (err)
        {
            reject({status:404, description: "User not found"});
        }
        if (user.password === body.password) {
            var user = {username:username};
            User.updateOne(user,body,(err, updated) => {
                if (err)
                {
                    reject({status:400, description: "Username or email is already used"});
                }
                resolve({status: 200, description:"Success"});
            });
        }
        else {
            bcrypt.genSalt(10, (err, salt) => 
            {
                if(err) 
                {
                    console.error('There was an error', err);
                }
                else 
                {
                    bcrypt.hash(body.password, salt, (err, hash) => {
                        if(err) {
                            console.error('There was an error', err);
                        }
                        else 
                        {
                            body.password = hash;
                            var user = {username:username};
                            User.updateOne(user,body,(err, updated) => {
                                if (err)
                                {
                                    reject({status:400, description: "Username or email is already used"});
                                }
                                const payload = {
                                    id: body._id,
                                    name: body.username,
                                }
                                jwt.sign(payload, 'secret', {
                                    expiresIn: 3600
                                }, (err, token) => {
                                    if(err) 
                                    {
                                        console.error('There is some error in token', err);
                                    }
                                    else 
                                    {
                                        resolve({status: 200, token: token});
                                    }
                                });
                            });

                        }
                    });
                }
            });
        } 
    });
  });
}
