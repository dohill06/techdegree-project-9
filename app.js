'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const sequelize = require('./models').sequelize;

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// JSON parsing
app.use(express.json());

// test the database connection
sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});

// require routes
const homeRoutes = require('./routes');
const userRoutes = require('./routes/users');

// TODO setup your api routes here
app.use(homeRoutes);
app.use('api/users', userRoutes);


// send 404 if no other route matched
app.use((req, res) => {
	res.status(404).json({
		message: 'Route Not Found',
	});
});

// setup a global error handler
app.use((err, req, res, next) => {
	if (enableGlobalErrorLogging) {
		console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
	}

	res.status(err.status || 500).json({
		message: err.message,
		error: {},
	});
});

// set our port
const port = process.env.PORT || 5000;

// start listening on our port
sequelize.sync().then(() => {
	app.listen(port, () => {
		console.log(`Express server is listening on port ${port}`);
	});
});