/**
	* Created by hoss on 3/12/2017.
	*/

const fs = require("fs");
const Task = require("data.task");


const makeDir = (filename) =>
	new Task((rej, res) =>
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


// fs.mkdirSync(__dirname + '/heroku', err => err);
// fs.mkdirSync(__dirname + '/heroku/server', err=> err);

const mapObj={
	'process.env.MONGO_USERNAME':'process.env.MONGODB_USERNAME',
	'process.env.MONGO_PASSWORD':'process.env.MONGODB_PASSWORD',
	'db: {':`db: {
		uri: process.env.MONGODB_URI || "mongodb://localhost/vemapp",`
};

const re = new RegExp(Object.keys(mapObj).join("|"),"g");

console.log(mapObj['db: {']);
const app =
readFile("config.js", "utf-8")
		.map(contents => contents.replace(re,matched=> mapObj[matched]))
		.chain(contents => writeFile("heroku/config.js", contents))
		.chain(contents => readFile("config.js", "utf-8"))
		.map(contents => contents.replace("4", "9"))
		.chain(contents => writeFile("config2.js", contents))


app.fork(e => console.log(e),
	x => console.log('success'))


// const isThere = x =>({x,concat:({x:y})=>isThere(x && y),inspect:()=>`isThere(${x})`})


// const some = isThere(true).concat(isThere(fs.existsSync('heroku') ));

//const directory =xs => xs.reduce((acc,x)=> fs.existsSync(acc) && x,true);
//const append = xs => xs.reduce((acc, x)=> acc + fs.mkdirSync(x),'');


//console.log(result);


// ar.reduce((a,b)=>{
//
// if(!fs.)
//
//  a+b,{};
//
//
// }


// );

//console.log(some);


// if(!fs.existsSync(heroku)){
// 	fs.mkdirSync(heroku);
//
// }
