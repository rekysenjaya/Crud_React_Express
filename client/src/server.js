import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import escape from 'jsesc';
import logger from 'morgan';
import cookieParser from 'cookie-parser';

const app = express();
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')))
app.use('/public', express.static(path.join(__dirname, '../public')))

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config');
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

const renderFullPage = html => {
	const initialState = { todos, users };
	const initialStateJSON = escape( // So safe!
		JSON.stringify(initialState),
		{ wrap: true, isScriptContext: true, json: true }
	);
	return `
	<!doctype html>
	<html lang="utf-8">
		<head>
			<link rel="stylesheet" href="/public/css/styleTwitter.css">
			<script>
				window.initialState = ${initialStateJSON}
			</script>
		</head>
		<body>
			<section id="appBody" class="appBody">${html}</section>
			<div class="footer">Copyright Reky Senjaya</div>
			<script src="/static/bundle.js"></script>
		</body>
	</html>
	`
};

let todos = []; // Status are stored here
let users = [{ page: 'login' }]; // User are stored here



app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.get('/', function (req, res) {
	const page = renderFullPage('');

	res.status(200).send(page);
});

app.post('/api/todos', function (req, res) {
	todos = req.body.todos;
	if (Array.isArray(todos)) {
		res.status(201).send(JSON.stringify({ success: true }));
	} else {
		res.status(200).send(JSON.stringify({ success: false, error: "expected `todos` to be array" }));
	}
});

app.post('/api/users', function (req, res) {
	users = req.body.users;
	if (Array.isArray(users)) {
		res.status(201).send(JSON.stringify({ success: true }));
	} else {
		res.status(200).send(JSON.stringify({ success: false, error: "expected `users` to be array" }));
	}
});

app.get('*', function (req, res) {
	res.status(404).send('Server.js > 404 - Page Not Found');
});

app.use((err, req, res, next) => {
	console.error("Error on request %s %s", req.method, req.url);
	console.error(err.stack);
	res.status(500).send("Server error");
});

process.on('uncaughtException', evt => {
	console.log('uncaughtException: ', evt);
});

app.listen(3000, function () {
	console.log('Listening on port 3000');
});
