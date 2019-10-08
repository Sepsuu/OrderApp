'use strict';

var fs         = require('fs'),
    path       = require('path'),
    http       = require('http'),
    cors       = require('cors'),
    passport   = require('passport'),
    dotenv     = require('dotenv').config(),
    auth       = require('./helpers/auth'),
    bodyParser = require('body-parser');
const mongoose = require('mongoose');
const recv     = require('./rabbit-utils/receiveTask');


var app = require('connect')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');

var serverPort = 8080;
var mongoURL = process.env.MONGO_URI
var corsOrigin = process.env.CORS_ORIGIN
// Connect to MongoDB
mongoose.connect(mongoURL, {useNewUrlParser: true,})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
      console.log(err);
      process.exit();
});

// Enable cors
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());


// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  app.use(middleware.swaggerSecurity({
    //manage token function in the 'auth' module
    Bearer: auth.verifyToken
  }));

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));
  
  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());


  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    setTimeout(recv.getTaskFromQueue, 25000);

  });

});