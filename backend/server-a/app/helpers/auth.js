'use strict';
 
var jwt    = require('jsonwebtoken');
var dotenv = require('dotenv').config();

const SHARED_SECRET = process.env.SECRET

exports.verifyToken = function (req, authOrSecDef, token, callback) {
    // Extract Token from header
    if (token && token.indexOf("Bearer ") == 0) {
        var tokenString = token.split(' ')[1];
        jwt.verify(tokenString, SHARED_SECRET, function (verificationError, decodedToken) {
            //check if the JWT was verified correctly
            if (verificationError == null && decodedToken ) {
                //add the token to the request so that we
                //can access it in the endpoint code if necessary
                req.auth = decodedToken;
                return callback();
                
            } else {
                //return the error in the callback if the JWT was not verified
                return callback();
            }
        });
    } else {
        //return the error in the callback if the Authorization header doesn't have the correct format
        return callback();
    }
};

