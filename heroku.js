/**
	* Created by hoss on 3/12/2017.
	*/

const fs = require("fs-extra");
const Task = require("data.task");
const path = require("path");

const copyPaste = (filename, destination) =>
	new Task((res, rej) =>
		fs.copy(filename, destination, (err, contents) =>
			err ? rej(err) : res(contents)));

const makeDir = (filename) =>
	new Task((rej, res) =>
		// returns undefined
		fs.mkdirSync(filename, (err, contents) =>
			err ? rej(err) : res(contents)));

const readFile = (filename, enc) =>
	new Task((rej, res) =>
		fs.readFile(filename, enc, (err, contents) =>
			err ? rej(err) : res(contents)));

const writeFile = (filename, enc) =>
	new Task((rej, res) =>
		fs.writeFile(filename, enc, (err, success) =>
			err ? rej(err) : res(success)));


fs.mkdirSync(__dirname + "/heroku", err => err);
fs.mkdirSync(__dirname + "/heroku/server", err => err);

const strReplaceObj = {
	"process.env.MONGO_USERNAME": "process.env.MONGODB_USERNAME",
	"process.env.MONGO_PASSWORD": "process.env.MONGODB_PASSWORD",
	"db: {": `db: {
		uri: process.env.MONGODB_URI || "mongodb://localhost/vemapp",`
};

const regInit = new RegExp(Object.keys(strReplaceObj).join("|"), "g");
const dirCopy = {
	"server/locales": "heroku/server/locales",
	"server/public":	"heroku/server/public",
	"server/views": "heroku/server/views",
	"server/bundle.js": "heroku/server/bundle.js"
}

const locations = Object.entries(dirCopy);

const app =
	readFile("config.js", "utf-8")
		.map(contents => contents.replace(regInit, matched => strReplaceObj[matched]))
		.chain(contents => writeFile("heroku/config.js", contents))
		.chain(contents => readFile("config.js", "utf-8"))
		.map(contents => contents.replace("4", "9"))
		.chain(contents => writeFile("config2.js", contents))
		.chain(contents => locations.forEach(([origin,base])=> copyPaste(origin, base)))


app.fork(e => console.log(e),
	x => console.log("success"));





