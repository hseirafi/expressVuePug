const entries = require("object.entries");
const fs = require("fs-extra");
const Task = require("data.task");
const fantasy = require("folktale");
const path = require("path");







const makeDir = (filename) =>
	new Task((rej, res) =>
		fs.mkdirp(filename, (err, contents) =>
			err ? rej(err) : res(contents)));

const readFile = (filename, enc) =>
	new Task((rej, res) =>
		fs.readFile(filename, enc, (err, contents) =>
			err ? rej(err) : res(contents)));

const writeFile = (filename, enc) =>
	new Task((rej, res) =>
		fs.writeFile(filename, enc, (err, success) =>
			err ? rej(err) : res(success)));


const strReplaceObj = {
	"process.env.MONGO_USERNAME": "process.env.MONGODB_USERNAME",
	"process.env.MONGO_PASSWORD": "process.env.MONGODB_PASSWORD",
	"db: {": `db: {
		uri: process.env.MONGODB_URI || "mongodb://localhost/vemapp",`
};

const regInit = new RegExp(Object.keys(strReplaceObj).join("|"), "g");
const dirCopy = {
	"server/locales": "heroku/server/locales",
	"server/public": "heroku/server/public",
	"server/views": "heroku/server/views",
	"server/bundle.js": "heroku/server/bundle.js"
};

if (!Object.entries) {
	entries.shim();
}

const locations = Object.entries(dirCopy);

const app =
		makeDir(__dirname + "/heroku/server")
		.chain(content => readFile("config.js", "utf-8"))
		.map(contents => contents.replace(regInit, matched => strReplaceObj[matched]))
		.chain(contents => writeFile("heroku/config.js", contents))
		.chain(contents => readFile("package.json", "utf-8"))
		.map(contents => contents.replace("cross-env NODE_ENV=production node server/index.js", "cross-env NODE_ENV=production node server/bundle.js"))
		.chain(contents => writeFile("heroku/package.json", contents))
		.map(content => locations.forEach(([origin, base]) => fs.copy(origin, base)));
		app.fork(e => console.log(e),
			x => console.log("success"));


if (fs.exists("/heroku/.gitignore")){
	console.log("exists");
}else{
	const writeIgnore =
readFile(".gitignore")
	.chain(contents => writeFile("heroku/.gitignore", contents));
	writeIgnore.fork(e=> console.log(e), x=> console.log("success"));
}


