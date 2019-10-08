Web Architectures -
### Project plan

Initial timetable for the research, design and implementation of the architecture. The timetable is kept up to date. 

Severi Peltonen: Backend,
Mika Roisko: Backend/frontend,
Petteri Ranto: Frontend

Severi Peltonen is mainly responsible for the backend, Mika Roisko is responsible for the dependencies between frontend and backend and Petteri Ranto is mainly responsible for the frontend.

We estimate that each member will give at least 8-15h per week for this project. This estimate is going to variate depending on the workload in the current week. This estimate is also updated during the project.

#### GitLab Issue Boards
Our group will be using GitLab Issue Boards. Our "Issue Master" is initially Severi Peltonen, but there might be cases that other group members will also assign tasks to each other. In our group, tasks are divided by the categories in which they belong to, for example, frontend tasks go to Petteri Ranto. 

We used Issue Board at the beginning of the project, but after that we used it a quite little. Issue board is very useful thing, but with this small group, it didn't bring any extra value for our work. Communication and division of the tasks was mostly done with WhatsApp and face-to-face meetings.

### Documentation of the created system


#### System architecture
The focus should on applying what has been learned on the course about Web Architectures. Using proper architectural descriptions and UML diagrams would be appropriated, but the groups are welcome to use any reasonable way of describing the system.

![system architecture](https://i.imgur.com/vclCwiW.jpg)

##### System architecture description

Above is our system architecture. Our application consits of 5 main components which are: Frontend, backend(server-a handles communication with frontend), mongo database, rabbitmq message broker and server-b which 'handles' all the coming orders.

User makes requests through react web application and these requests are being handled in server-a. Before making any orders user must create a new user for him/herself. After login user is able to make orders, follow the state of the orders and change user settings (username, email, password). 

When user creates a new order this order is immediately put into database and this created database object is sent to rabbitmq message broker. At the same time server-b is subscribing message queue A and when a new order appears into message queue A, server-b starts to handle it. After handling an order server-b sends this order object back to rabbitmq message queue B. When server-a gets an order back it updates the corresponding orderobject in the database. 

Because orders can be created at any time and orders might come back from server-b at any time. React application polls backend every 8 sec to get all the orders. We also added deleteorder endpoint to API, because it is cool to eat your sandwich when it is ready

Our user management is made with JSON web token (JWT). JWT is a JSON-based open standard (RFC 7519) for creating access tokens that assert some number of claims. In our application user gets access token when he/she logs in and every time user makes request to the backend this access token is checked before user is let into endpoints. This way users cannot delete each other or change each others settings.


![frontend architecture](https://imgur.com/wO7qo6w.jpg)

Here is main frontend components of our application. 

In the frontend we are using lots of Redux forms and validation for those. The Header component is always visible and every component is mounted inside of the App component. In addition to these components, our application has the PublicRoute and the PrivateRoute component and the SandwichService component. The SandwichService component isn't ready. Whole frontend is made with Redux libary and architectural patterns.

Implementing this size application with Redux, makes it a little bit complex and adds more boilerplate code to it. But in the longrun, if this application grows bigger, it becomes more easier to manage and then we can notice the great benefits of Redux.

#### Used technologies

*Backend*

Backend implementation is made with NodeJs with a help of Swagger. Our backend server uses Connect framework. Connect is an extensible HTTP server framework for node using "plugins" known as middleware. In server-a backend we used a lot of different libraries like bcrypt to hash passwords, validator to validate incoming data, jsonwebtoken to verify users.

*Database*

We decided to use MongoDB as database system for this project. MongoDB is a database that stores data as documents. To handle mongodb data we use Mongoose. Mongoose is an object document mapper (ODM). With mongoose we can define objects fast with strongly-typed schema that is mapped to a mongodb document. I think we could have used postgreSql but for this app we think that mongodb is much easier to use and faster to implement

*Message Broker*

For message passing we used RabbitMQ. RabbitMQ is an open-source message-broker software (sometimes called message-oriented middleware). With rabbitmq we can easily pass order objects betweeb server-a and server-b because server-b is subscribing task queue and server-a sends orders to this queue.
Server-a also defines where to answer. Server-a is subscribing this ready queue and server-b knows to send orders to ready queue.

*Frontend*

Frontend is created with React. Frontend is also using Redux state management libary. For API calls, frontend uses Axios libary. Axios is easy tool for making HTTP requests. Top of that we are using Bootstrap libary for styling the application and JWT web token for user authentication.


#### How the produced system can be tested
Backend services can be build and executed with docker-compose up command in Docker. Frontend can be executed with npm start command.

After everything is up and running, tester can enter to http://localhost:3000/
application now routes the tester to the login page. The tester can press the Register link in the application header. After filling the register form, the tester presses submit and application routes tester back to the login page. Now the tester can login with newly created account. After successfull login, the tester arrives to our application home page. Home provides possibility to order sandwiches and see all of the orders. The Tester can order a sandwich and after submitting the order, it is visible in the orderlist. The order is now processed and after the order is ready, the tester can press the eat-button. If the tester wants to modify its account, then the tester can go to the profile page. The Profile page shows all the user account details and the tester can modify those and submit modified details. The tester can also delete account. If the tester modifies its account details, application routes the tester back to the login page. The Tester can now login again.

Errors and suggestions are showed to the tester when something isn't possible to do. For example, if the tester is trying to register with the username that already exists in our application. Noticeable thing is that in the profile page, if the tester wants to change the password, then the password field must be cleared first (E.g. Ctrl+A -> delete). If there comes some network errors when testing this project, please check the makemeasandwich-frontend/src/api/serverA.js and the base url of axios. If testing with Docker toolbox, this base url must be changed to http://DOCKERTOOLBOXIP:12345/v1/
